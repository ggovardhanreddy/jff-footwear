// Edge Function: analyze-product-images
// Admin-only Gemini Vision analysis → structured product JSON for the create form.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { ANALYSIS_SYSTEM_PROMPT, buildUserPrompt } from "./prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
const MAX_IMAGES = 3;
const CONFIDENCE_THRESHOLD = 70;
const GENERIC_NAME_RE =
  /^(jff|product|slipper|sandal|flip\s*flop|slide)?[\s_-]*\d+$/i;

type ConfidenceMap = Record<string, number>;

type AnalysisJson = {
  productName?: string;
  shortDescription?: string;
  longDescription?: string;
  specifications?: Record<string, unknown>;
  features?: string[];
  seo?: Record<string, unknown>;
  tags?: string[];
  confidence?: ConfidenceMap;
};

type InlineImage = { mimeType: string; data: string };

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function extractJson(text: string): AnalysisJson {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1].trim() : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Model did not return JSON");
  }
  return JSON.parse(raw.slice(start, end + 1)) as AnalysisJson;
}

function isGenericName(name: string): boolean {
  const n = name.trim();
  if (!n) return true;
  if (GENERIC_NAME_RE.test(n)) return true;
  if (/^(blue|red|black|white|green|brown)\s+slipper$/i.test(n)) return true;
  if (/^(product|slipper|sandal)\s*\d*$/i.test(n)) return true;
  return false;
}

function applyConfidenceGates(analysis: AnalysisJson): {
  analysis: AnalysisJson;
  needsReview: boolean;
  flagged: string[];
} {
  const confidence = { ...(analysis.confidence || {}) };
  const specs = { ...(analysis.specifications || {}) } as Record<string, unknown>;
  const flagged: string[] = [];
  let needsReview = false;

  const attrToSpec: Record<string, string> = {
    color: "color",
    material: "material",
    pattern: "pattern",
    productType: "productType",
    comfortCategory: "comfortLevel",
    sole: "soleMaterial",
    gender: "gender",
    usage: "usage",
  };

  for (const [key, score] of Object.entries(confidence)) {
    const n = Number(score);
    confidence[key] = Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
    if (confidence[key] < CONFIDENCE_THRESHOLD) {
      needsReview = true;
      flagged.push(key);
      const specKey = attrToSpec[key];
      if (specKey && specKey in specs) {
        specs[specKey] = "Needs Manual Review";
      }
    }
  }

  if (isGenericName(String(analysis.productName || ""))) {
    needsReview = true;
    flagged.push("productName");
  }

  return {
    analysis: {
      ...analysis,
      specifications: specs,
      confidence,
      features: Array.isArray(analysis.features) ? analysis.features : [],
      tags: Array.isArray(analysis.tags) ? analysis.tags : [],
      seo: analysis.seo || {},
    },
    needsReview,
    flagged,
  };
}

async function fetchImageAsInline(url: string): Promise<InlineImage> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image (${res.status}). Prefer uploading again so analysis can use inline data.`);
  }
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const mimeType = contentType.split(";")[0].trim() || "image/jpeg";
  const buf = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) {
    binary += String.fromCharCode(...buf.subarray(i, i + chunk));
  }
  return { mimeType, data: btoa(binary) };
}

async function callGemini(model: string, parts: unknown[]): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on this Edge Function");
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
      systemInstruction: {
        parts: [{ text: ANALYSIS_SYSTEM_PROMPT }],
      },
    }),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(
      payload?.error?.message || `Gemini request failed (${res.status}) with model ${model}`
    );
  }

  const text =
    payload?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || "")
      .join("") || "";
  if (!text) {
    throw new Error(`Empty Gemini response from ${model}`);
  }
  return text;
}

async function callGeminiWithFallback(parts: unknown[]): Promise<string> {
  let lastError = "Gemini request failed";
  for (const model of GEMINI_MODELS) {
    try {
      return await callGemini(model, parts);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }
  throw new Error(lastError);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Unauthorized — sign in again as admin" }, 401);
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized — session expired. Sign in again." }, 401);
    }

    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return jsonResponse({ error: "Admin only — promote your profile role to admin" }, 403);
    }

    const body = await req.json();
    const hints = body.hints as { gender?: string } | undefined;

    const inlineFromBody: InlineImage[] = Array.isArray(body.images)
      ? body.images
          .map((img: { mimeType?: string; data?: string }) => ({
            mimeType: String(img?.mimeType || "image/jpeg"),
            data: String(img?.data || "").replace(/^data:[^;]+;base64,/, ""),
          }))
          .filter((img: InlineImage) => img.data)
          .slice(0, MAX_IMAGES)
      : [];

    const imageUrls = (Array.isArray(body.imageUrls) ? body.imageUrls : [])
      .map((u: unknown) => String(u || "").trim())
      .filter(Boolean)
      .slice(0, MAX_IMAGES);

    const inlineImages: InlineImage[] = [...inlineFromBody];
    if (!inlineImages.length) {
      for (const url of imageUrls) {
        inlineImages.push(await fetchImageAsInline(url));
      }
    }

    if (!inlineImages.length) {
      return jsonResponse({ error: "At least one image is required" }, 400);
    }

    const imageParts = inlineImages.map((img) => ({
      inlineData: { mimeType: img.mimeType || "image/jpeg", data: img.data },
    }));

    const parts = [{ text: buildUserPrompt(hints) }, ...imageParts];

    let text = await callGeminiWithFallback(parts);
    let parsed = extractJson(text);

    if (isGenericName(String(parsed.productName || ""))) {
      const retryParts = [
        {
          text:
            buildUserPrompt(hints) +
            "\nPrevious name was too generic. Generate a richer premium e-commerce product name (no SKUs, no JFF prefix).",
        },
        ...imageParts,
      ];
      text = await callGeminiWithFallback(retryParts);
      parsed = extractJson(text);
    }

    const { analysis, needsReview, flagged } = applyConfidenceGates(parsed);

    if (!analysis.productName && Number(analysis.confidence?.productType || 0) === 0) {
      return jsonResponse(
        {
          error: "Image does not appear to be footwear",
          analysis,
          needsReview: true,
          flagged,
        },
        422
      );
    }

    return jsonResponse({
      analysis,
      needsReview,
      flagged,
      raw: parsed,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});

import { createMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${COMPANY.fullName} website and customer inquiries.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20">
      <div className="container-custom section-padding">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display text-brand-black">Privacy Policy</h1>
          <p className="mt-4 text-sm text-brand-muted">
            Last updated: {new Date().toLocaleDateString("en-IN")}
          </p>

          <div className="mt-12 space-y-8 text-body">
            <section>
              <h2 className="heading-section mb-4 text-xl">Introduction</h2>
              <p>
                {COMPANY.fullName} (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;) respects your privacy. This policy explains how
                we collect, use, and protect information when you visit our
                website or contact us via WhatsApp, email, or phone.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">
                Information We Collect
              </h2>
              <p>We may collect the following information when you contact us:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Name and contact details (email, phone number)</li>
                <li>Product inquiry details (size, color, quantity)</li>
                <li>Messages sent through our contact form or WhatsApp</li>
                <li>Basic website usage data via standard server logs</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">
                How We Use Your Information
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>To respond to product and wholesale inquiries</li>
                <li>To provide pricing and availability information</li>
                <li>To process and fulfill orders</li>
                <li>To improve our products and customer service</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">Data Storage</h2>
              <p>
                This website does not use a database or third-party authentication
                services. Inquiry data is handled through WhatsApp and email
                communication channels directly by our team.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">Contact Us</h2>
              <p>
                For privacy-related questions, contact us at{" "}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-brand-accent hover:underline"
                >
                  {COMPANY.email}
                </a>{" "}
                or call {COMPANY.phone}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

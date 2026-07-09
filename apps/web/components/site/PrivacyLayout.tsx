import PolicyLayout from "./PolicyLayout";
import { PRIVACY_SECTIONS } from "@/data/pages";

interface PrivacyLayoutProps {
  breadcrumb: { label: string; href: string }[];
}

export default function PrivacyLayout({ breadcrumb }: PrivacyLayoutProps) {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PolicyLayout
      title="Privacy Policy"
      description="How JFF Footwear collects, uses, and protects your information."
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
    >
      {PRIVACY_SECTIONS.map((section) => (
        <section key={section.id} id={section.id}>
          <h2 className="heading-section mb-4 text-xl">{section.title}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)} className="mb-4">
              {p}
            </p>
          ))}
          {section.list ? (
            <ul className="list-disc space-y-2 pl-6">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </PolicyLayout>
  );
}

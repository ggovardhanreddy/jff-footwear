import { createMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of service for using the ${COMPANY.fullName} website and inquiry services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="pt-20">
      <div className="container-custom section-padding">
        <div className="mx-auto max-w-3xl">
          <h1 className="heading-display text-brand-black">Terms of Service</h1>
          <p className="mt-4 text-sm text-brand-muted">
            Last updated: {new Date().toLocaleDateString("en-IN")}
          </p>

          <div className="mt-12 space-y-8 text-body">
            <section>
              <h2 className="heading-section mb-4 text-xl">Acceptance of Terms</h2>
              <p>
                By accessing and using the {COMPANY.fullName} website, you agree
                to these Terms of Service. If you do not agree, please do not use
                our website.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">Product Inquiries</h2>
              <p>
                This website is for product discovery and inquiry purposes. All
                pricing, availability, and order terms are confirmed directly
                through WhatsApp, email, or phone communication with our sales
                team.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">
                Product Information
              </h2>
              <p>
                We strive to display accurate product images and descriptions.
                Colors may vary slightly due to screen settings and manufacturing
                batches. Final specifications are confirmed at the time of order.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">
                Intellectual Property
              </h2>
              <p>
                All content on this website — including images, text, logos, and
                designs — is the property of {COMPANY.fullName} and protected by
                applicable intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">Limitation of Liability</h2>
              <p>
                {COMPANY.fullName} shall not be liable for any indirect,
                incidental, or consequential damages arising from the use of this
                website or reliance on its content.
              </p>
            </section>

            <section>
              <h2 className="heading-section mb-4 text-xl">Contact</h2>
              <p>
                Questions about these terms? Reach us at{" "}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-brand-accent hover:underline"
                >
                  {COMPANY.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

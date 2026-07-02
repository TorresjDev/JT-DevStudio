import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JT Dev Studio",
  description: "Terms governing the use of JT Dev Studio and its freelance development services.",
};

const sections = [
  { id: "overview", label: "1. Overview" },
  { id: "use-of-site", label: "2. Use of the Site" },
  { id: "freelance-services", label: "3. Freelance Services" },
  { id: "intellectual-property", label: "4. Intellectual Property" },
  { id: "donations", label: "5. Donations" },
  { id: "limitation-of-liability", label: "6. Limitation of Liability" },
  { id: "no-warranty", label: "7. No Warranty" },
  { id: "governing-law", label: "8. Governing Law" },
  { id: "contact", label: "9. Contact" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-4 sm:px-8 py-16 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#DAA520]">Terms of Service</h1>
        <p className="text-sm text-[#C0C0C0]/60 mt-2">Effective Date: July 1, 2026</p>
      </div>

      {/* Two-column layout on large screens */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

        {/* Sidebar TOC -- sticky on lg, hidden on mobile */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DAA520]/70 mb-3">
              On this page
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm text-[#C0C0C0]/60 hover:text-[#DAA520] transition-colors py-1 border-l-2 border-transparent hover:border-[#DAA520] pl-3"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <article className="space-y-10 min-w-0">

          <section id="overview">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">1. Overview</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              These Terms of Service govern your use of JT Dev Studio (
              <a href="https://jt-devstudio.tech" className="text-[#DAA520] hover:underline">
                jt-devstudio.tech
              </a>
              ) and any freelance software development services provided by Jesus Torres. By using
              this site or engaging services, you agree to these terms.
            </p>
          </section>

          <section id="use-of-site">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">2. Use of the Site</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              You may use this site for lawful purposes only. You agree not to attempt to gain
              unauthorized access to any part of the site, its infrastructure, or other users&apos;
              data. We reserve the right to suspend or terminate access for violations of these
              terms.
            </p>
          </section>

          <section id="freelance-services">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">3. Freelance Services</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed mb-3">
              The following terms apply to all freelance software development engagements:
            </p>
            <ul className="list-disc list-inside text-[#C0C0C0]/80 space-y-2 leading-relaxed">
              <li>
                <span className="text-[#C0C0C0]">Deposit</span> -- a non-refundable deposit of 50%
                of the agreed project total is required before work begins.
              </li>
              <li>
                <span className="text-[#C0C0C0]">Milestones</span> -- larger projects are broken
                into milestones with payment due at each milestone as agreed in writing.
              </li>
              <li>
                <span className="text-[#C0C0C0]">Final payment</span> -- the remaining balance is
                due in full before final deliverables, source code, or deployment credentials are
                transferred to the client.
              </li>
              <li>
                <span className="text-[#C0C0C0]">Scope changes</span> -- any changes to the agreed
                scope must be approved in writing and may adjust the project timeline and cost.
              </li>
            </ul>
          </section>

          <section id="intellectual-property">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">
              4. Intellectual Property
            </h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              Upon receipt of full payment, the client receives full ownership of the custom work
              product created for their project. Jesus Torres retains the right to display the work
              in his portfolio and reference it publicly unless the client requests otherwise in
              writing prior to project start. All third-party libraries, frameworks, and open-source
              tools remain subject to their own licenses.
            </p>
          </section>

          <section id="donations">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">5. Donations</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              Donations made through this site are voluntary and non-refundable. They do not
              constitute payment for services or create any contractual obligation.
            </p>
          </section>

          <section id="limitation-of-liability">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              To the maximum extent permitted by law, Jesus Torres&apos; total liability for any
              claim arising from a freelance engagement is limited to the total amount paid by the
              client for that specific engagement. We are not liable for indirect, incidental, or
              consequential damages.
            </p>
          </section>

          <section id="no-warranty">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">7. No Warranty</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              This site and its content are provided &quot;as is&quot; without warranties of any
              kind. We do not guarantee uninterrupted access or that the site will be free from
              errors.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">8. Governing Law</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              These Terms are governed by the laws of the State of Texas, United States. Any
              disputes shall be resolved in the courts of Texas.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">9. Contact</h2>
            <p className="text-[#C0C0C0]/80 leading-relaxed">
              Questions about these terms can be sent to{" "}
              <a href="mailto:j.torres3.dev@gmail.com" className="text-[#DAA520] hover:underline">
                j.torres3.dev@gmail.com
              </a>
              .
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}

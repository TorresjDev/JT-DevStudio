import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JT Dev Studio",
  description: "Terms governing the use of JT Dev Studio and its freelance development services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#DAA520] mb-2">Terms of Service</h1>
      <p className="text-sm text-[#C0C0C0]/60 mb-10">Effective Date: July 1, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">1. Overview</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          These Terms of Service govern your use of JT Dev Studio (
          <a href="https://jt-devstudio.tech" className="text-[#DAA520] hover:underline">
            jt-devstudio.tech
          </a>
          ) and any freelance software development services provided by Jesus Torres. By using this
          site or engaging services, you agree to these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">2. Use of the Site</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          You may use this site for lawful purposes only. You agree not to attempt to gain
          unauthorized access to any part of the site, its infrastructure, or other users&apos; data.
          We reserve the right to suspend or terminate access for violations of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">3. Freelance Services</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed mb-3">
          The following terms apply to all freelance software development engagements:
        </p>
        <ul className="list-disc list-inside text-[#C0C0C0]/80 space-y-2 leading-relaxed">
          <li>
            <span className="text-[#C0C0C0]">Deposit</span> -- a non-refundable deposit of 50% of
            the agreed project total is required before work begins.
          </li>
          <li>
            <span className="text-[#C0C0C0]">Milestones</span> -- larger projects are broken into
            milestones with payment due at each milestone as agreed in writing.
          </li>
          <li>
            <span className="text-[#C0C0C0]">Final payment</span> -- the remaining balance is due in
            full before final deliverables, source code, or deployment credentials are transferred to
            the client.
          </li>
          <li>
            <span className="text-[#C0C0C0]">Scope changes</span> -- any changes to the agreed scope
            must be approved in writing and may adjust the project timeline and cost.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">4. Intellectual Property</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          Upon receipt of full payment, the client receives full ownership of the custom work product
          created for their project. Jesus Torres retains the right to display the work in his
          portfolio and reference it publicly unless the client requests otherwise in writing prior to
          project start. All third-party libraries, frameworks, and open-source tools remain subject
          to their own licenses.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">5. Donations</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          Donations made through this site are voluntary and non-refundable. They do not constitute
          payment for services or create any contractual obligation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">6. Limitation of Liability</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          To the maximum extent permitted by law, Jesus Torres&apos; total liability for any claim
          arising from a freelance engagement is limited to the total amount paid by the client for
          that specific engagement. We are not liable for indirect, incidental, or consequential
          damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">7. No Warranty</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          This site and its content are provided &quot;as is&quot; without warranties of any kind. We
          do not guarantee uninterrupted access or that the site will be free from errors.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">8. Governing Law</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          These Terms are governed by the laws of the State of Texas, United States. Any disputes
          shall be resolved in the courts of Texas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[#DAA520]/90 mb-3">9. Contact</h2>
        <p className="text-[#C0C0C0]/80 leading-relaxed">
          Questions about these terms can be sent to{" "}
          <a href="mailto:j.torres3.dev@gmail.com" className="text-[#DAA520] hover:underline">
            j.torres3.dev@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}

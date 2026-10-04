import { PolicyLayout } from "@/components/legal/PolicyLayout";

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of use" lastUpdated="30 September 2026">
      <section>
        <h2 className="font-display text-xl font-semibold">1. What Noma is</h2>
        <p className="mt-2 text-text-muted">
          Noma is a user interface and orchestration layer that helps diaspora
          senders plan cross-border payments to Nigeria. You describe intent in
          natural language, review structured plans, and confirm before any
          execution step. Today the product runs against{" "}
          <strong className="font-medium text-text">Monad testnet</strong> for
          demonstration and hackathon development.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          2. What Noma is not
        </h2>
        <p className="mt-2 text-text-muted">
          Noma is <strong className="font-medium text-text">not</strong> a bank,
          money transmitter, remittance provider, or licensed payment institution.
          We do not hold customer fiat, operate pooled accounts for users, or
          guarantee delivery of naira to beneficiaries. Any future fiat or
          off-ramp steps are intended to flow through{" "}
          <strong className="font-medium text-text">licensed third-party</strong>{" "}
          partners, not through Noma as custodian.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">3. Your account</h2>
        <p className="mt-2 text-text-muted">
          Access uses a <strong className="font-medium text-text">passkey</strong>{" "}
          (via Mera) to derive an on-chain address. You control your passkey and
          optional recovery phrase. We store only non-secret passkey metadata
          (such as a credential identifier) in your browser to streamline
          sign-in. Loss of your passkey or recovery phrase may mean loss of
          access to the same on-chain account.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          4. Confirm before action
        </h2>
        <p className="mt-2 text-text-muted">
          You must review and explicitly confirm payment plans before Noma
          initiates on-chain or partner actions. Do not confirm amounts,
          beneficiaries, or schedules you do not understand. Testnet assets have
          no real-world value unless you choose to use real configurations later
          at your own risk.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          5. Acceptable use
        </h2>
        <p className="mt-2 text-text-muted">
          You agree not to use Noma for unlawful activity, sanctions evasion,
          fraud, or abuse of partners or networks. You are responsible for
          compliance with laws that apply to you in your country of residence and
          for truthful information about beneficiaries and payment purpose.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          6. No warranties
        </h2>
        <p className="mt-2 text-text-muted">
          The service is provided &quot;as is&quot; during development. We do
          not warrant uninterrupted operation, accurate FX quotes, or successful
          settlement. Blockchain transactions may fail, revert, or be affected by
          network conditions and smart-contract risk.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          7. Limitation of liability
        </h2>
        <p className="mt-2 text-text-muted">
          To the fullest extent permitted by law, Noma and its contributors are
          not liable for indirect, incidental, or consequential damages, or for
          loss of funds, arising from use of the demo, passkey loss, user error,
          or third-party services (RPC providers, wallets, faucets, partners).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">8. Changes</h2>
        <p className="mt-2 text-text-muted">
          We may update these terms as the product evolves. Continued use after
          updates means you accept the revised terms. Material changes for a
          production launch will require appropriate notice and legal review.
        </p>
      </section>
    </PolicyLayout>
  );
}

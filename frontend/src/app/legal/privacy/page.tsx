import { PolicyLayout } from "@/components/legal/PolicyLayout";

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy policy" lastUpdated="30 September 2026">
      <section>
        <h2 className="font-display text-xl font-semibold">1. Overview</h2>
        <p className="mt-2 text-text-muted">
          Noma is designed to minimize collection of personal data. The current
          demo is largely <strong className="font-medium text-text">client-side</strong>:
          planning UI, passkey sign-in, and testnet balance checks. This policy
          describes what the app stores locally and what leaves your device when
          you use standard blockchain features.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          2. Data stored on your device
        </h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-text-muted">
          <li>
            <strong className="font-medium text-text">Passkey credential id</strong>{" "}
            in browser local storage (no private keys or PRF output).
          </li>
          <li>
            <strong className="font-medium text-text">Session address</strong> in
            session storage so the UI can show your account during the tab
            session after sign-in.
          </li>
          <li>
            Chat content you enter remains in page memory until you refresh; we
            do not operate a persistent chat backend in the current demo.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          3. Data we do not collect (today)
        </h2>
        <p className="mt-2 text-text-muted">
          We do not require your legal name, email, or phone for the passkey
          demo. We do not sell personal information. We do not intentionally
          collect payment card or bank account details in this repository
          version.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          4. On-chain and network data
        </h2>
        <p className="mt-2 text-text-muted">
          When you use a blockchain address, transactions and balances are{" "}
          <strong className="font-medium text-text">public on Monad testnet</strong>.
          Balance checks use a Monad RPC endpoint (configured via environment
          variables). RPC providers may log requests according to their own
          policies.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">
          5. Third-party services
        </h2>
        <p className="mt-2 text-text-muted">
          Passkey ceremonies are handled by your device and platform (for example
          Google Password Manager, iCloud Keychain, or Windows Hello) via the
          Mera library. Links such as the Monad testnet faucet open third-party
          sites governed by their terms and privacy policies.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">6. Security</h2>
        <p className="mt-2 text-text-muted">
          Signing keys live in memory for your session and are cleared on
          sign-out. Never share recovery phrases or approve transactions you do
          not understand. Use a secure browser context (HTTPS or localhost).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">7. Children</h2>
        <p className="mt-2 text-text-muted">
          Noma is not directed at children under 13 (or the minimum age required
          in your jurisdiction). We do not knowingly collect data from children.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">8. Changes</h2>
        <p className="mt-2 text-text-muted">
          If we add accounts, analytics, or partner APIs, we will update this
          policy and describe new categories of data before production use.
        </p>
      </section>
    </PolicyLayout>
  );
}

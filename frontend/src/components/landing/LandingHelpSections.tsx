import { FAQ_ITEMS, WALKTHROUGH_STEPS } from "./landingGuideContent";

export function LandingWalkthroughSection() {
  return (
    <section
      id="walkthrough"
      aria-labelledby="walkthrough-heading"
      className="scroll-mt-24 border-t border-border pt-16 lg:pt-20"
    >
      <h2
        id="walkthrough-heading"
        className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        How to use Noma
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
        First time with passkeys? Follow these steps on{" "}
        <span className="font-medium text-text">Monad testnet</span>. You can
        scroll back to Get started anytime to create an account or sign in.
      </p>
      <ol className="mt-10 space-y-8">
        {WALKTHROUGH_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-xl border border-border bg-surface p-5 sm:gap-6 sm:p-6"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-mono text-sm font-medium text-text"
              aria-hidden
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function LandingFaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-border pt-16 lg:pt-20"
    >
      <h2
        id="faq-heading"
        className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        Frequently asked questions
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
        Common questions from new users, especially people who have not used a
        passkey wallet before.
      </p>
      <dl className="mt-10 space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-border bg-surface p-5 sm:p-6"
          >
            <dt className="font-display text-base font-semibold text-text sm:text-lg">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

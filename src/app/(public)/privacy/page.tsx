export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-muted-foreground">
      <h1 className="font-display text-3xl text-foreground">Privacy Notice</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Updated October 19, 2025
      </p>

      <section className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
        <p>
          NextStep Money keeps things simple: your answers stay in your
          browser. We do not run a database, create accounts, or send personal
          information off your device.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          What we store
        </h2>
        <p>
          Your intake answers and plan progress are saved to{" "}
          <strong>sessionStorage</strong>. This means the data remains available
          during your current browser session so you can refresh the page
          without losing your place. Closing the tab or your browser clears the
          data automatically.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          What we do not store
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>No names, emails, or identifying accounts.</li>
          <li>No tracking pixels, cookies, or analytics scripts.</li>
          <li>No credit information, account numbers, or balances.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          How to remove your data
        </h2>
        <p>
          Click “Start over” from the intake flow or close the browser tab to
          clear your plan. You can also manually clear session storage in your
          browser if you prefer.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Future updates
        </h2>
        <p>
          Upcoming versions may add locale-specific resources or optional
          account linking. Those features will remain opt-in, and this notice
          will change before they launch.
        </p>

        <p>
          Questions? Email{" "}
          <a href="mailto:hello@nextstepmoney.com">
            hello@nextstepmoney.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

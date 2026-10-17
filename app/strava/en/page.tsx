import { Masthead, Foot } from "@/app/components/chrome";

export const metadata = {
  title: "Strava Support — Tubeless Lab",
  description:
    "Support for the Strava integration in Tubeless Lab: how to connect, disconnect, and what happens to your data.",
};

export default function StravaSupport() {
  return (
    <>
      <Masthead lang="en" />
      <main className="shell doc">
        <div className="eyebrow">Strava integration</div>
        <h1>Strava Support</h1>
        <p className="updated">
          Last updated: October 17, 2026 · <a href="/strava">Ler em português</a>
        </p>

        <p>
          Help for athletes who connect Strava to <strong>Tubeless Lab</strong> (TBLS Lab): how the
          integration works, how to disconnect, and what happens to your data.
        </p>

        <h2><span className="num">01</span>Contact support</h2>
        <p>
          Questions, problems with the connection, or data requests? Write to us and we will reply as soon as
          possible.
        </p>
        <div className="contact-card">
          <div><span className="k">Email:&nbsp;</span><span className="v">setup@tubelesslab.com</span></div>
          <div><span className="k">Subject:&nbsp;</span><span className="v">Strava support</span></div>
        </div>
        <p>
          <a href="mailto:setup@tubelesslab.com?subject=Strava%20support">Email support</a>
        </p>

        <h2><span className="num">02</span>What the integration does</h2>
        <p>
          When you connect Strava, Tubeless Lab reads the distance of your own activities and the gear (bikes)
          on your account. You link each Strava bike to one of your wheelsets in the app, and the distance is
          used to:
        </p>
        <ul>
          <li>show <strong>tire wear</strong> (km accumulated since installation);</li>
          <li>apply a soft adjustment to <strong>your own</strong> sealant-life estimate.</li>
        </ul>
        <p>This information is shown only to you. We do not share it with other users.</p>

        <h2><span className="num">03</span>How to connect</h2>
        <ol>
          <li>Open the app and go to <strong>Settings → Integrations</strong>;</li>
          <li>Tap <strong>Connect with Strava</strong> and approve access on the Strava page;</li>
          <li>In <strong>Edit wheels</strong>, choose the matching Strava bike (gear);</li>
          <li>Your kilometers will sync automatically from then on.</li>
        </ol>

        <h2><span className="num">04</span>How to disconnect</h2>
        <ul>
          <li><strong>In the app:</strong> go to <strong>Settings → Integrations</strong> and tap <strong>Disconnect from Strava</strong>;</li>
          <li>
            <strong>On Strava:</strong> open{" "}
            <a href="https://www.strava.com/settings/apps" rel="noopener">strava.com/settings/apps</a> and
            revoke access for Tubeless Lab.
          </li>
        </ul>

        <h2><span className="num">05</span>Your data</h2>
        <div className="callout">
          <div className="label">Summary</div>
          <p>
            We use Strava data <strong>only</strong> to provide features to the athlete who authorized it. We
            do not sell it, share it, aggregate it across users, or use it to train any model, including AI
            models.
          </p>
        </div>
        <ul>
          <li>On disconnect, we delete the Strava data we hold: the gear link and the last synced distance;</li>
          <li>
            The tire-wear counter is a number calculated for your own wheels. It stays in your account after
            you disconnect and can be reset at any time in <strong>Edit wheels</strong>;
          </li>
          <li>Strava data is cached for at most 7 days;</li>
          <li>
            To delete everything, delete your account in the app or see the{" "}
            <a href="/exclusao-de-dados">Data Deletion</a> page.
          </li>
        </ul>
        <p>
          See also our <a href="/privacidade">Privacy Policy</a> (in Portuguese). The Strava section below
          summarizes it in English.
        </p>
        <div className="callout">
          <div className="label">Strava integration — privacy summary</div>
          <p>
            If you choose to connect Strava, we access the distance of your activities and the gear (bikes) on
            your Strava account. We use this data only to show tire wear for your own wheels and to refine your
            own sealant-life estimate. It is shown only to you. We do not sell it, share it with third parties,
            aggregate it across users, or use it to train any model, including AI models. We keep Strava data
            cached for at most 7 days. When you disconnect Strava, we delete the Strava data we hold. You can
            revoke access at strava.com/settings/apps and request deletion of your data at
            setup@tubelesslab.com.
          </p>
        </div>

        <h2><span className="num">06</span>Troubleshooting</h2>
        <h3>Kilometers are not updating</h3>
        <p>
          Open the app so it can sync, and confirm the wheelset is linked to the correct Strava bike.
        </p>
        <h3>The bike I want is not listed</h3>
        <p>
          Make sure the bike exists in your Strava profile under Gear and that the activity was recorded with
          it.
        </p>
        <h3>I linked the wrong bike</h3>
        <p>Open <strong>Edit wheels</strong> and choose the correct gear.</p>
        <h3>Still stuck?</h3>
        <p>
          Email <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>.
        </p>

        <div className="callout">
          <div className="label">Strava</div>
          <p>
            Powered by Strava. Tubeless Lab is not affiliated with, endorsed by, or sponsored by Strava, Inc.
            Strava is a trademark of Strava, Inc.
          </p>
        </div>
      </main>
      <Foot lang="en" />
    </>
  );
}

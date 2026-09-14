import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { GITHUB_EDITOR_REPO, GITHUB_EDITOR_URL, GITHUB_ORG } from "@/lib/site";
import { TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What the Aphelion website and the Aphelion Editor desktop application do with your data: no analytics, no accounts, no telemetry, no tracking.",
  path: "/privacy",
});

const ISSUES_URL = `${GITHUB_EDITOR_URL}/issues`;
const VERCEL_PRIVACY_URL = "https://vercel.com/legal/privacy-policy";
const GITHUB_PRIVACY_URL =
  "https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement";

export default function PrivacyPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-14">
      <h1 className="aph-page-title">Privacy</h1>
      <p className="mt-3 text-muted">
        This page covers the Aphelion website and the Aphelion Editor desktop application. The
        short version is that neither one collects personal data.
      </p>

      <div className="aph-dock mt-8">
        <div className="aph-dock__title">Summary</div>
        <div className="aph-dock__body">
          <ul className="space-y-2 text-sm text-muted">
            <li>No accounts, no sign-in and no contact forms.</li>
            <li>No cookies, no analytics and no advertising scripts.</li>
            <li>The website reads public GitHub data on the server, not from your browser.</li>
            <li>The editor runs locally, ships no telemetry and keeps your files on your machine.</li>
          </ul>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="aph-section-title">This website</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li>
            The site sets no cookies and writes nothing to browser storage. There is no analytics,
            advertising or session-recording code on any page.
          </li>
          <li>
            Release lists and documentation are read from the public GitHub API when a page is
            rendered. Those requests are made by the server, so your IP address and browser are not
            sent to GitHub by visiting a page.
          </li>
          <li>
            The site is hosted on Vercel. Vercel keeps standard request logs for every deployment,
            which can include an IP address, a user agent and the requested path. Those logs are
            used for operations, capacity and abuse prevention. Vercel&apos;s handling of them is
            described in the{" "}
            <a className={TEXT_LINK} href={VERCEL_PRIVACY_URL} target="_blank" rel="noreferrer">
              Vercel privacy policy
            </a>
            .
          </li>
          <li>
            Builds and documentation links point at github.com. Once you follow one of those links,
            GitHub&apos;s own practices apply. See the{" "}
            <a className={TEXT_LINK} href={GITHUB_PRIVACY_URL} target="_blank" rel="noreferrer">
              GitHub privacy statement
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="aph-section-title">The desktop application</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li>
            The editor runs entirely on your computer. Projects, media references, preferences,
            logs and plugins are written to the locations you choose and are never uploaded.
          </li>
          <li>
            There is no telemetry, crash reporting, usage counting or update check. The editor does
            not contact a server on its own.
          </li>
          <li>
            Media decoding, the video encoder and the plugin runtime are bundled with the
            application. Nothing needs to be downloaded at run time.
          </li>
          <li>
            If you install a plugin written by someone else, that plugin runs in the same process
            and can do whatever its author wrote. Install plugins from sources you trust.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="aph-section-title">Changes and contact</h2>
        <p className="mt-4 text-sm text-muted">
          If any of the above changes, this page will be updated before the change ships. Questions
          about this policy can go in the{" "}
          <a className={TEXT_LINK} href={ISSUES_URL} target="_blank" rel="noreferrer">
            issue tracker
          </a>{" "}
          for {GITHUB_ORG}/{GITHUB_EDITOR_REPO}.
        </p>
        <p className="mt-3 font-mono text-[11px] text-muted">Last updated 9 September 2026.</p>
      </section>
    </div>
  );
}

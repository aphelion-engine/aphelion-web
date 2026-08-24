import { ArrowDownToSquare, LogoGithub, LogoPython, PlugConnection } from "@gravity-ui/icons";
import { Card, Heading, Paragraph } from "@heroui/react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button-link";
import { CopyCommand } from "@/components/copy-command";
import { ReleaseBoard } from "@/components/releases/release-board";
import { loadClassifiedReleases } from "@/lib/releases/load";
import { pickPrimaryAsset } from "@/lib/releases/types";
import {
  GITHUB_ORG,
  GITHUB_SDK_REPO,
  GITHUB_SDK_URL,
  PIP_GIT_INSTALL,
  PIP_LOCAL_INSTALL,
} from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SDK",
  description: "Download Aphelion Plugin SDK releases synced from GitHub.",
};

export default async function SdkPage(): Promise<React.ReactElement> {
  const classified = await loadClassifiedReleases(GITHUB_ORG, GITHUB_SDK_REPO);
  const latestAsset = classified.latest ? pickPrimaryAsset(classified.latest) : null;
  const latestHref =
    latestAsset?.browser_download_url ?? classified.latest?.html_url ?? `${GITHUB_SDK_URL}/releases`;

  return (
    <div>
      <section className="release-hero border-b border-separator">
        <div className="mx-auto max-w-6xl animate-fade-up space-y-6 px-4 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Plugin SDK</p>
          <Heading level={1} className="max-w-3xl text-4xl tracking-tight sm:text-6xl">
            Build plugins. Ship them. Stay on the public API.
          </Heading>
          <Paragraph className="max-w-2xl text-lg text-muted">
            Releases are pulled live from GitHub. Grab the newest build, the latest
            tag ending in <span className="font-mono text-foreground">-stable</span>,
            or any older drop.
          </Paragraph>
          <div className="flex flex-wrap gap-3">
            <ButtonLink size="lg" href={latestHref}>
              <ArrowDownToSquare className="size-5" />
              {classified.latest ? `Get ${classified.latest.tag_name}` : "View GitHub releases"}
            </ButtonLink>
            <ButtonLink size="lg" href={GITHUB_SDK_URL} variant="secondary" target="_blank" rel="noreferrer">
              <LogoGithub className="size-5" />
              Repository
            </ButtonLink>
            <ButtonLink size="lg" href="/docs/sdk" variant="secondary">
              Docs
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <div className="animate-fade-up-delay">
          <ReleaseBoard
            classified={classified}
            githubUrl={`${GITHUB_SDK_URL}/releases`}
            emptyLabel="No GitHub releases yet. Tag a release on aphelion-sdk and it will show up here."
          />
        </div>

        <Card>
          <Card.Header>
            <PlugConnection className="size-5 text-accent" />
            <Card.Title>What you get</Card.Title>
            <Card.Description>
              Typed plugin API, examples, and the aphelion-sdk CLI. Import aphelion_sdk only.
            </Card.Description>
          </Card.Header>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LogoPython className="size-5 text-accent" />
            <Heading level={2}>Install with pip</Heading>
          </div>
          <CopyCommand command={PIP_GIT_INSTALL} />
          <CopyCommand command={PIP_LOCAL_INSTALL} />
        </div>
      </div>
    </div>
  );
}

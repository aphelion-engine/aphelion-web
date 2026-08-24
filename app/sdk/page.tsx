import { ArrowDownToSquare, CircleInfo, LogoGithub, LogoPython, PlugConnection } from "@gravity-ui/icons";
import { Alert, Card, Heading, Paragraph } from "@heroui/react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button-link";
import { CopyCommand } from "@/components/copy-command";
import {
  GITHUB_SDK_URL,
  PIP_GIT_INSTALL,
  PIP_LOCAL_INSTALL,
  SDK_DOWNLOAD_HREF,
  SDK_VERSION,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "SDK",
  description: "Download the Aphelion SDK and build plugins for Aphelion products.",
};

export default function SdkPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <div className="space-y-4">
        <Heading level={1}>Aphelion SDK</Heading>
        <Paragraph className="text-muted">
          Public Python SDK for writing plugins that target Aphelion products.
          Video effects, custom panels, and dialogs ship against this package —
          never against editor internals. The same SDK is the extension surface
          for future apps in the line.
        </Paragraph>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={SDK_DOWNLOAD_HREF}>
            <ArrowDownToSquare className="size-4" />
            Download v{SDK_VERSION} (.zip)
          </ButtonLink>
          <ButtonLink href={GITHUB_SDK_URL} variant="secondary" target="_blank" rel="noreferrer">
            <LogoGithub className="size-4" />
            Source on GitHub
          </ButtonLink>
          <ButtonLink href="/docs/sdk" variant="secondary">
            SDK docs
          </ButtonLink>
        </div>
      </div>

      <Alert>
        <Alert.Indicator>
          <CircleInfo className="size-5" />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>Plugins stay public-API only</Alert.Title>
          <Alert.Description>
            Subclass the documented SDK types. Do not import editor modules such
            as ui, core, or render.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <Card>
        <Card.Header>
          <PlugConnection className="size-5 text-accent" />
          <Card.Title>What you get</Card.Title>
          <Card.Description>
            Package sources, examples, and the aphelion-sdk CLI used to build plugin wheels.
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-2 text-sm text-muted">
          <p>Video effect plugins with optional Qt panels and dialogs.</p>
          <p>Typed public API intended for all Aphelion products as they ship.</p>
        </Card.Content>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LogoPython className="size-5 text-accent" />
          <Heading level={2}>Install with pip</Heading>
        </div>
        <Paragraph size="sm" className="text-muted">
          Prefer pip when you already have the monorepo, or install from Git:
        </Paragraph>
        <CopyCommand command={PIP_LOCAL_INSTALL} />
        <CopyCommand command={PIP_GIT_INSTALL} />
      </div>

      <ButtonLink variant="ghost" href="/products">
        Back to products
      </ButtonLink>
    </div>
  );
}

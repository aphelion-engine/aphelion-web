import type { Metadata } from "next";
import NextLink from "next/link";

import { CopyCommand } from "@/components/copy-command";
import { PageHeader, Section } from "@/components/page";
import { PluginExample } from "@/components/plugin-example";
import { pageMetadata } from "@/lib/seo";
import {
    GITHUB_EDITOR_URL,
    PIP_CHECKOUT_INSTALL,
    PIP_PACKAGE_INSTALL,
    SDK_RELEASES_URL,
} from "@/lib/site";
import { INLINE_CODE, TEXT_LINK } from "@/lib/ui";

export const metadata: Metadata = pageMetadata({
  title: "Plugins — Custom Video Effects in Python | Aphelion Editor",
  absoluteTitle: true,
  description:
    "Aphelion Editor plugins are Python classes that add custom video-effect nodes. See what they extend, where they load from, and how to enable and reload one.",
  path: "/plugins",
});

export default function PluginsPage(): React.ReactElement {
  return (
    <div>
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
            <NextLink className={TEXT_LINK} href="/">
              Aphelion
            </NextLink>
            <span aria-hidden> › </span>
            <span aria-current="page">Plugins</span>
          </nav>
        }
        title="Aphelion Editor plugins"
        lede={
          <>
            A plugin adds a node type to the editor. It is an ordinary Python class that receives a
            frame and returns a modified one, and once it is in the right folder it appears in the
            node menu next to the built-ins — with its own inspector properties and its own entry in
            the search palette.
          </>
        }
        actions={
          <>
            <NextLink className="aph-btn" href="/sdk">
              Plugin SDK
            </NextLink>
            <NextLink className="aph-btn aph-btn--ghost" href="/docs/editor/plugins">
              Plugin documentation
            </NextLink>
          </>
        }
      />

      <Section id="what" title="What a plugin can do">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Add an effect node",
              body: "Custom image processing that is not in the built-in library: a specific blur, a bespoke colour transform, a procedural pattern, an analysis pass.",
            },
            {
              name: "Add a generator",
              body: "A node that produces a frame from nothing, such as a pattern, a chart or a procedurally drawn element.",
            },
            {
              name: "Expose properties",
              body: "Number, slider, toggle, choice, colour and text properties, all of which the inspector renders and the timeline can keyframe.",
            },
            {
              name: "Publish status and errors",
              body: "A plugin can report a problem through the same error path a built-in node uses, so a failure surfaces in the editor rather than as a silent black frame.",
            },
            {
              name: "Ship as a package",
              body: "A plugin can be a single Python file or a packaged wheel with its own dependencies, which matters as soon as it needs a library the editor does not bundle.",
            },
            {
              name: "Be enabled per project",
              body: "Plugins are enabled, disabled and reloaded from Preferences without restarting the editor, so iterating on one is a save-and-reload loop.",
            },
          ].map((item) => (
            <li key={item.name} className="aph-card">
              <span className="text-base font-semibold text-[#e6e6e6]">{item.name}</span>
              <span className="text-sm text-muted">{item.body}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="shape" title="What a plugin looks like">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              Plugins import <code className={INLINE_CODE}>aphelion_sdk</code> and subclass the same
              effect base the built-in nodes use. The base handles socket setup, property
              registration and the frame contract, so a plugin author writes the operation and
              nothing else.
            </p>
            <p>
              The frame contract is deliberately narrow: a plugin receives a frame as a NumPy array
              and returns one of the same shape. That is the whole surface a plugin has to agree on,
              which is why the same class works whether it is processing a 960px proxy during
              playback or a full-resolution frame during export.
            </p>
            <p>
              <NextLink className={TEXT_LINK} href="/sdk">
                SDK install steps and API surface
              </NextLink>
              {" · "}
              <NextLink className={TEXT_LINK} href="/docs/sdk/authoring">
                Authoring plugins
              </NextLink>
            </p>
          </div>
          <PluginExample />
        </div>
      </Section>

      <Section id="install" title="Installing a plugin">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aph-prose">
            <h3 className="!mt-0">A single file or folder</h3>
            <p>
              Drop the Python module into the editor&apos;s{" "}
              <code className={INLINE_CODE}>plugins/</code> directory, or into{" "}
              <code className={INLINE_CODE}>userdata/plugins/</code> to keep it out of the
              application folder. The user location is the better choice for anything you want to
              survive an upgrade.
            </p>
            <h3>A packaged plugin</h3>
            <p>
              If the plugin ships as a wheel — for instance because it depends on a library the
              editor does not bundle — install it into the editor&apos;s environment and the loader
              picks it up on the next scan.
            </p>
          </div>
          <div className="space-y-4">
            <CopyCommand
              label="Install the SDK into the editor's environment"
              command={PIP_PACKAGE_INSTALL}
            />
            <CopyCommand
              label="Or install from a checkout of the SDK repository"
              command={PIP_CHECKOUT_INSTALL}
            />
            <p className="text-sm text-muted">
              The Windows installer already bundles the SDK wheel and a helper script, so plugin
              authors on Windows do not need a separate download.
            </p>
          </div>
        </div>
      </Section>

      <Section id="discovery" title="How plugins are found and loaded">
        <div className="aph-prose">
          <p>
            The editor scans its plugin directories at startup and builds a list of available
            plugins. Each one is listed in Preferences under Plugins with an enable toggle and a
            reload action. Disabling a plugin removes its nodes from the menu; reloading re-imports
            the module so a change to the file takes effect without restarting.
          </p>
          <p>
            A plugin that fails to import is reported as a failed plugin rather than crashing the
            editor, so a broken third-party file does not take the whole application with it.
          </p>
          <p>
            <NextLink className={TEXT_LINK} href="/docs/editor/plugins">
              Plugin discovery order and Preferences
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/docs/sdk/packaging">
              Packaging plugins for distribution
            </NextLink>
            {" · "}
            <NextLink className={TEXT_LINK} href="/docs/editor/architecture">
              Architecture: how nodes are registered
            </NextLink>
          </p>
        </div>
      </Section>

      <Section id="get-sdk" title="Getting the SDK">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="aph-prose">
            <p>
              The SDK is published as <code className={INLINE_CODE}>aphelion-plugin-sdk</code>. Its
              documentation covers the video-effect base classes, the widget primitives plugin UIs
              are built from, and how to package a plugin so someone else can install it.
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <NextLink className={TEXT_LINK} href="/sdk">
                Plugin SDK overview
              </NextLink>
            </li>
            <li>
              <NextLink className={TEXT_LINK} href="/docs/sdk/api">
                SDK API reference
              </NextLink>
            </li>
            <li>
              <NextLink className={TEXT_LINK} href="/docs/sdk/widgets">
                Plugin widgets
              </NextLink>
            </li>
            <li>
              <a className={TEXT_LINK} href={SDK_RELEASES_URL} target="_blank" rel="noreferrer">
                SDK releases on GitHub
              </a>
            </li>
            <li>
              <a className={TEXT_LINK} href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
                Editor source and issue tracker
              </a>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

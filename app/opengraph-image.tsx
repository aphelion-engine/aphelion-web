import { ImageResponse } from "next/og";

import { EDITOR_NODE_COUNT, EDITOR_VERSION, PYTHON_REQUIREMENT } from "@/lib/site";

/**
 * The branded social card, generated at build time.
 *
 * A static screenshot cannot serve this purpose: shared links need a
 * predictable 1200×630 frame that reads at thumbnail size in Discord, Reddit
 * and Slack, and that states what the project *is* in the same glance. This
 * composes one from the same palette the site uses, so it stays in step with
 * the rest of the brand without anyone re-exporting an image.
 */

export const alt =
  "Aphelion Editor — a node-based video compositor for desktop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1e1e1e",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(158,207,255,0.14), transparent 46%), radial-gradient(circle at 88% 92%, rgba(255,190,60,0.10), transparent 50%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 62,
              height: 62,
              borderRadius: 14,
              border: "1px solid #3a3a3a",
              backgroundColor: "#252525",
              color: "#9ecfff",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#f2f2f2", fontSize: 30, fontWeight: 700 }}>
              Aphelion Editor
            </div>
            <div style={{ color: "#8f8f8f", fontSize: 20, letterSpacing: 1 }}>
              NODE-BASED · PYTHON
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f7f7f7",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            A node-based video
          </div>
          <div
            style={{
              color: "#f7f7f7",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            compositor for the desktop
          </div>
          <div style={{ color: "#b8b8b8", fontSize: 27, marginTop: 22, lineHeight: 1.4 }}>
            Node graph · tracking · keying · color · roto · Python plugins
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {[`v${EDITOR_VERSION}`, `Python ${PYTHON_REQUIREMENT}`, `${EDITOR_NODE_COUNT} nodes`, "Windows · macOS · Linux"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  color: "#dcdcdc",
                  fontSize: 20,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1px solid #3a3a3a",
                  backgroundColor: "#252525",
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}

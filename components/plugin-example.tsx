/**
 * The shortest real plugin in the SDK. This is an excerpt of
 * `aphelion-sdk/examples/grayscale_effect.py`, trimmed to the parts that
 * matter when you are deciding whether to read further.
 */
const PLUGIN_SOURCE = `import aphelion_sdk


@aphelion_sdk.register_plugin
class GrayscaleEffect(aphelion_sdk.VideoEffectPlugin):
    plugin_name = "Grayscale"

    def setup_effect_properties(self) -> None:
        self.set_property(
            "amount",
            aphelion_sdk.slider_property(100, 0, 100, label="Amount", suffix="%"),
        )

    def process_frame(
        self,
        frame: aphelion_sdk.Frame,
        _frame_num: int,
    ) -> aphelion_sdk.Frame:
        amount = self.float_value("amount", 100.0) / 100.0
        luma = (
            frame[..., 0] * 0.2126 + frame[..., 1] * 0.7152 + frame[..., 2] * 0.0722
        )
        gray = luma[..., None].repeat(3, axis=2)
        return frame * (1.0 - amount) + gray * amount
`;

export function PluginExample(): React.ReactElement {
  return (
    <figure className="aph-terminal min-w-0">
      <figcaption className="aph-terminal__bar">
        <span>examples/grayscale_effect.py</span>
        <span className="aph-chip">Python</span>
      </figcaption>
      <pre className="aph-terminal__code">
        <code>{PLUGIN_SOURCE}</code>
      </pre>
    </figure>
  );
}

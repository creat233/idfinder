import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { PremiumOverlay } from "./components/PremiumOverlay";
import {
  BoutiqueHook,
  BoutiqueShop,
  BoutiqueFeatures,
  BoutiqueEssentiel,
  BoutiquePremium,
  BoutiqueDelivery,
  BoutiqueCTA,
} from "./scenes/boutique/BoutiqueScenes";

export const BOUTIQUE_DURATION = 1560; // 52s @30fps

const T = (presentation: any, d = 20) => (
  <TransitionSeries.Transition presentation={presentation} timing={springTiming({ config: { damping: 200 }, durationInFrames: d })} />
);

export const BoutiqueVideo = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, BOUTIQUE_DURATION], [0, 26]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${125 + shift}deg, hsl(220, 45%, 7%) 0%, hsl(200, 55%, 11%) 48%, hsl(250, 40%, 9%) 100%)`,
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const x = interpolate(Math.sin(frame * 0.006 + i * 1.7), [-1, 1], [8 + i * 20, 30 + i * 18]);
        const y = interpolate(Math.cos(frame * 0.008 + i * 2.1), [-1, 1], [10 + i * 20, 34 + i * 17]);
        const opacity = interpolate(Math.sin(frame * 0.012 + i), [-1, 1], [0.05, 0.11]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 280 + i * 90,
              height: 280 + i * 90,
              borderRadius: "50%",
              background: `radial-gradient(circle, hsla(${185 + i * 22}, 80%, 55%, ${opacity}) 0%, transparent 70%)`,
              filter: "blur(50px)",
            }}
          />
        );
      })}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={170}><BoutiqueHook /></TransitionSeries.Sequence>
        {T(fade())}
        <TransitionSeries.Sequence durationInFrames={230}><BoutiqueShop /></TransitionSeries.Sequence>
        {T(slide({ direction: "from-bottom" }))}
        <TransitionSeries.Sequence durationInFrames={250}><BoutiqueFeatures /></TransitionSeries.Sequence>
        {T(wipe({ direction: "from-left" }))}
        <TransitionSeries.Sequence durationInFrames={230}><BoutiqueEssentiel /></TransitionSeries.Sequence>
        {T(slide({ direction: "from-right" }))}
        <TransitionSeries.Sequence durationInFrames={230}><BoutiquePremium /></TransitionSeries.Sequence>
        {T(fade())}
        <TransitionSeries.Sequence durationInFrames={180}><BoutiqueDelivery /></TransitionSeries.Sequence>
        {T(slide({ direction: "from-bottom" }))}
        <TransitionSeries.Sequence durationInFrames={180}><BoutiqueCTA /></TransitionSeries.Sequence>
      </TransitionSeries>

      <PremiumOverlay accent="#22D3EE" />
    </AbsoluteFill>
  );
};

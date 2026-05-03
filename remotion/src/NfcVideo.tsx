import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { NfcIntro } from "./scenes/nfc/NfcIntro";
import { NfcStep1 } from "./scenes/nfc/NfcStep1";
import { NfcStep2 } from "./scenes/nfc/NfcStep2";
import { NfcStep3 } from "./scenes/nfc/NfcStep3";
import { NfcOutro } from "./scenes/nfc/NfcOutro";

export const NfcVideo = () => {
  const frame = useCurrentFrame();
  const bgHue = interpolate(frame, [0, 600], [270, 300]);
  const bgShift = interpolate(frame, [0, 600], [0, 25]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: `linear-gradient(${140 + bgShift}deg, hsl(${bgHue}, 40%, 8%) 0%, hsl(${bgHue + 20}, 45%, 14%) 50%, hsl(${bgHue + 35}, 35%, 10%) 100%)`,
      }} />
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [20 + i * 20, 30 + i * 18]);
        const y = interpolate(Math.sin(frame * 0.02 + i * 2), [-1, 1], [20 + i * 18, 35 + i * 18]);
        const opacity = interpolate(Math.sin(frame * 0.015 + i), [-1, 1], [0.04, 0.1]);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: 260 + i * 90, height: 260 + i * 90, borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${270 + i * 30}, 65%, 50%, ${opacity}) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }} />
        );
      })}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}><NfcIntro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><NfcStep1 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><NfcStep2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><NfcStep3 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={150}><NfcOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

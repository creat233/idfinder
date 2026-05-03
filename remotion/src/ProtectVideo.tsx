import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { ProtectIntro } from "./scenes/protect/ProtectIntro";
import { ProtectStep1 } from "./scenes/protect/ProtectStep1";
import { ProtectStep2 } from "./scenes/protect/ProtectStep2";
import { ProtectStep3 } from "./scenes/protect/ProtectStep3";
import { ProtectOutro } from "./scenes/protect/ProtectOutro";

export const ProtectVideo = () => {
  const frame = useCurrentFrame();
  const bgHue = interpolate(frame, [0, 600], [210, 240]);
  const bgShift = interpolate(frame, [0, 600], [0, 30]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: `linear-gradient(${135 + bgShift}deg, hsl(${bgHue}, 45%, 8%) 0%, hsl(${bgHue + 15}, 50%, 14%) 50%, hsl(${bgHue + 30}, 40%, 10%) 100%)`,
      }} />
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [15 + i * 25, 25 + i * 20]);
        const y = interpolate(Math.sin(frame * 0.02 + i * 2), [-1, 1], [15 + i * 20, 30 + i * 20]);
        const opacity = interpolate(Math.sin(frame * 0.015 + i), [-1, 1], [0.04, 0.1]);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: 280 + i * 80, height: 280 + i * 80, borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${210 + i * 25}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }} />
        );
      })}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}><ProtectIntro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><ProtectStep1 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><ProtectStep2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><ProtectStep3 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={150}><ProtectOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

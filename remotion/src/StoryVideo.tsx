import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { StoryIntro } from "./scenes/story/StoryIntro";
import { StoryStep1 } from "./scenes/story/StoryStep1";
import { StoryStep2 } from "./scenes/story/StoryStep2";
import { StoryStep3 } from "./scenes/story/StoryStep3";
import { StoryOutro } from "./scenes/story/StoryOutro";

export const StoryVideo = () => {
  const frame = useCurrentFrame();
  const bgHue = interpolate(frame, [0, 600], [30, 50]);
  const bgShift = interpolate(frame, [0, 600], [0, 20]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{
        background: `linear-gradient(${130 + bgShift}deg, hsl(${bgHue}, 30%, 8%) 0%, hsl(${bgHue + 10}, 40%, 12%) 50%, hsl(${bgHue + 20}, 25%, 8%) 100%)`,
      }} />
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [18 + i * 22, 28 + i * 20]);
        const y = interpolate(Math.sin(frame * 0.02 + i * 2), [-1, 1], [18 + i * 22, 32 + i * 18]);
        const opacity = interpolate(Math.sin(frame * 0.015 + i), [-1, 1], [0.04, 0.09]);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: 250 + i * 100, height: 250 + i * 100, borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${40 + i * 15}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
            filter: "blur(40px)",
          }} />
        );
      })}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}><StoryIntro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><StoryStep1 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><StoryStep2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}><StoryStep3 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={150}><StoryOutro /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

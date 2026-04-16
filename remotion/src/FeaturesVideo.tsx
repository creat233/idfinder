import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { FeaturesIntro } from "./scenes/features/FeaturesIntro";
import { FeaturesCards } from "./scenes/features/FeaturesCards";
import { FeaturesMCard } from "./scenes/features/FeaturesMCard";
import { FeaturesMore } from "./scenes/features/FeaturesMore";
import { FeaturesOutro } from "./scenes/features/FeaturesOutro";

export const FeaturesVideo = () => {
  const frame = useCurrentFrame();

  const bgHue = interpolate(frame, [0, 600], [260, 300]);
  const bgShift = interpolate(frame, [0, 600], [0, 30]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + bgShift}deg, hsl(${bgHue}, 40%, 8%) 0%, hsl(${bgHue + 20}, 45%, 12%) 50%, hsl(${bgHue + 40}, 35%, 8%) 100%)`,
        }}
      />

      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [20 + i * 25, 30 + i * 20]);
        const y = interpolate(Math.sin(frame * 0.02 + i * 2), [-1, 1], [15 + i * 20, 25 + i * 25]);
        const opacity = interpolate(Math.sin(frame * 0.015 + i), [-1, 1], [0.05, 0.1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: 300 + i * 100, height: 300 + i * 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, hsla(${270 + i * 40}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <FeaturesIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <FeaturesCards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <FeaturesMCard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <FeaturesMore />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <FeaturesOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

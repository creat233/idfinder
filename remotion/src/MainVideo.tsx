import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneStep1 } from "./scenes/SceneStep1";
import { SceneStep2 } from "./scenes/SceneStep2";
import { SceneStep3 } from "./scenes/SceneStep3";
import { SceneOutro } from "./scenes/SceneOutro";

export const MainVideo = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Persistent animated background
  const bgHue = interpolate(frame, [0, 600], [250, 280]);
  const bgShift = interpolate(frame, [0, 600], [0, 30]);

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + bgShift}deg, hsl(${bgHue}, 40%, 8%) 0%, hsl(${bgHue + 20}, 50%, 15%) 50%, hsl(${bgHue + 40}, 35%, 10%) 100%)`,
        }}
      />

      {/* Floating orbs */}
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [20 + i * 25, 30 + i * 20]);
        const y = interpolate(
          Math.sin(frame * 0.02 + i * 2),
          [-1, 1],
          [15 + i * 20, 25 + i * 25]
        );
        const opacity = interpolate(
          Math.sin(frame * 0.015 + i),
          [-1, 1],
          [0.05, 0.12]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 300 + i * 100,
              height: 300 + i * 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, hsla(${270 + i * 30}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}

      {/* Scene transitions */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneStep1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneStep2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneStep3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <SceneOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

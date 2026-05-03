import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { ReportVideo } from "./ReportVideo";
import { FeaturesVideo } from "./FeaturesVideo";
import { ProtectVideo } from "./ProtectVideo";
import { NfcVideo } from "./NfcVideo";
import { StoryVideo } from "./StoryVideo";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="report" component={ReportVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="features" component={FeaturesVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="protect" component={ProtectVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="nfc" component={NfcVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
    <Composition id="story" component={StoryVideo} durationInFrames={600} fps={30} width={1080} height={1920} />
  </>
);

# SDK quickstart

Agora Video SDK makes it easy to embed real-time video or voice chat into web, mobile and native apps. It enables one-to-one or group video and voice chat connections with smooth, jitter-free streaming. Thanks to Agora’s intelligent and global Software Defined Real-time Network (Agora SD-RTN™), you can rely on the highest available video and audio quality.

This example shows the minimum code you need to integrate high-quality, low-latency communication audio and video features into your react-native app using Agora Video SDK.

## Understand the code

You find the business logic for this quickstart sample in the [`AgoraManager`](../agora-manager/agoraManager.tsx) component. This component encapsulates the code to set up an instance of `RTCEngine`, join, and leave a channel. All examples in this repository extend the `AgoraManager` component to add functionality specific for that application.

For context on this implementation, and a full explanation of the essential code snippets used in this example, read the **SDK quickstart** document for your product of interest:

* [Video Calling](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native)
* [Voice Calling](https://docs.agora.io/en/voice-calling/get-started/get-started-sdk?platform=react-native)
* [Interactive Live Streaming](https://docs.agora.io/en/interactive-live-streaming/get-started/get-started-sdk?platform=android)
* [Broadcast Streaming](https://docs.agora.io/en/broadcast-streaming/get-started/get-started-sdk?platform=react-native)

For the UI implementation of this example, refer to [`AgoraUI`](../agora-manager/agoraUI.tsx).

## How to run this example

To see how to run this project, read the instructions in the main [README](../../README.md) or [SDK quickstart](https://docs-beta.agora.io/en/video-calling/get-started/get-started-sdk).




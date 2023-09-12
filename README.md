# Agora Video SDK for React Native reference app

This app demonstrates the use of [Agora Video SDK for React Native](https://docs.agora.io/en/video-calling/get-started/get-started-sdk) for real-time audio and video communication. It is a robust and comprehensive documentation reference app for React Native, designed to enhance your productivity and understanding. Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

- [Samples](#samples)
- [Prerequisites](#prerequisites)
- [Run this project](#run-this-project)
- [Contact](#contact)

## Samples

This reference app includes several samples that illustrate the functionality and features of Agora Video and Voice SDKs. Each sample is self-contained and the relevant code can be found in its own folder in the root directory. For more information about each sample, see:

- [SDK quickstart](./src/get-started-sdk/) - The minimum code you need to integrate high-quality, low-latency Video Calling features into your app using Video SDK.
- [Secure authentication with tokens](./src/authentication-workflow) - Quickly set up an authentication token
  server, retrieve a token from the server, and use it to connect securely to the SD-RTN as a specific user.


## Prerequisites

Before getting started with this reference app, ensure you have the following set up:

- [A React Native development environment](https://reactnative.dev/docs/environment-setup).
- An IDE of your choice.
- An Agora account and project.
- A computer with Internet access. Ensure that no firewall is blocking your network communication.

## Run this project

To run this reference app, take the following steps:

1. **Clone the repository**

    To clone the repository to your local machine, open Terminal and navigate to the directory where you want to clone the repository. Then, use the following command:

    ```sh
    git clone https://github.com/AgoraIO/video-sdk-samples-reactnative.git
    ```

1. **Open the project**

   Open your project in an IDE and launch a terminal. Then, install the required dependencies:

   ```bash
   yarn install
   ```   

1. **Modify the project configuration**

   The app loads connection parameters from [`./src/agora-manager/config.ts`](./src/agora-manager/config.ts). Ensure that the file is populated with the required parameter values before running the application.

    - `uid`: The user ID associated with the application.
    - `appId`: (Required) The unique ID for the application obtained from [Agora Console](https://console.agora.io). 
    - `channelName`: The default name of the channel to join.
    - `rtcToken`:An token generated for `channelName`. You generate a temporary token using the [Agora token builder](https://agora-token-generator-demo.vercel.app/).
    - `serverUrl`: The URL for the token generator. See [Secure authentication with tokens](authentication-workflow) for information on how to set up a token server.
    - `tokenExpiryTime`: The time in seconds after which a token expires.

    If a valid `serverUrl` is provided, all samples use the token server to obtain a token except the **SDK quickstart** project that uses the `rtcToken`. If a `serverUrl` is not specified, all samples except **Secure authentication with tokens** use the `rtcToken` from `config.json`.

1. **Build and run the project**

   - **For IOS**:
      
      1. Install CocoaPods:
         ```
          npx pod-install
         ```
      2. Run your project inside an IOS emulator:
       
         ```
         yarn run ios
         ```
   - **For Android**:
      
      1. Run your project inside an Android emulator:
         
         ```
         yarn run android
         ```

1. **Run the samples in the reference app**

    From the main app screen, choose and launch a sample.

## Contact

If you have any questions, issues, or suggestions, please file an issue in our [GitHub Issue Tracker](https://github.com/AgoraIO/video-sdk-samples-reactnative/issues).

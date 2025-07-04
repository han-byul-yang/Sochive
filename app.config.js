module.exports = {
  expo: {
    name: "Sochive",
    slug: "sochive",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "sochive",
    userInterfaceStyle: "automatic",
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryAddUsageDescription:
          "이 앱은 사진을 저장하기 위해 앨범 접근 권한이 필요합니다.",
      },
      bundleIdentifier: "com.sochive.app",
      supportsTablet: true,
      usesAppleSignIn: true,
    },
    android: {
      config: {
        googleMobileAdsAppId: "ca-app-pub-3940256099942544~3347511713",
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.sochive.app",
      versionCode: 1,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
      redirectUri: "sochive://",
    },
    plugins: [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.434276661706-48nvb462fal15k7g9keiajbpobefmc7t",
        },
      ],
      [
        "expo-splash-screen",
        // "expo-build-properties",
        {
          // ios: {
          //   useFrameworks: "static",
          // },
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },

    cli: {
      appVersionSource: "appVersion",
    },

    extra: {
      cloudinaryUrl: process.env.CLOUDINARY_URL,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      scheme: process.env.SCHEME,
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: "dc65718c-c142-4b2e-8f14-fcd7b2b18fbd",
      },
    },
  },
};

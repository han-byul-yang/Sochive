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
      bundleIdentifier: "com.sochive.app",
      supportsTablet: true,
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
    },
    plugins: [
      "expo-router",
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

    extra: {
      apiUrl: process.env.API_URL,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
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
      geminiApiKey: process.env.GEMINI_API_KEY,
      developmentApiUrl: {
        android: process.env.API_URL,
        ios: process.env.API_URL,
      },
      scheme: process.env.SCHEME,
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: "132c6ece-7387-4706-bd3e-39ba1a12da23",
      },
    },
  },
};

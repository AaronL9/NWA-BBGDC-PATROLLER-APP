module.exports = {
  expo: {
    name: "Neigborhood Watch - patroller",
    slug: "patroller-app",
    version: "1.0.4",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "native",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.aaron01.mobilePatroll",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-notifications",
        { sounds: ["./assets/alert_patroller_sound.wav"] },
      ],
    ],
    extra: {
      eas: {
        projectId: "0ef8837e-ada4-451f-ad4d-138cc77933b4",
      },
    },
    owner: "aaron01",
  },
};

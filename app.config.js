export default ({ config }) => ({
  ...config,
  name: "Forecast",
  slug: "forecast",
  scheme: "com.supabase",
  version: "1.0.0",
  orientation: "portrait",
  // icon: "",
  userInterfaceStyle: "automatic",
  // splash: {
  //   image: "",
  //   resizeMode: "",
  //   backgroundColor: "",
  // },
  // assetBundlePatterns: ["**/*"],
  // ios: {},
  // android: {},
  plugins: ["expo-router"],
});

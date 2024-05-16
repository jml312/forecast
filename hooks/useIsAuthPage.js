import { useSegments } from "expo-router";

export const useIsAuthPage = () => {
  const segments = useSegments();
  return !segments.includes("(app)");
};

import { useSegments } from "expo-router";

export const useIsAuthPage = () => {
  const segments = useSegments();

  const isAuthPage = !segments.includes("(app)");

  return isAuthPage;
};

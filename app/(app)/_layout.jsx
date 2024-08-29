import { Redirect, Stack } from "expo-router";
import { useSupabase } from "@/contexts";
import { useIsAuthPage } from "@/hooks";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ProtectedLayout() {
  const isAuthPage = useIsAuthPage();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useSupabase();

  // useEffect(() => {
  //   if (!isAuthLoading && isAuthenticated && isAuthPage) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated, isAuthPage, isAuthLoading]);

  // if (!isAuthenticated) {
  //   return <Redirect href="/sign-in" />;
  // }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-class"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

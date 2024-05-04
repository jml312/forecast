import { Redirect, Stack } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import { useIsAuthPage } from "@/hooks";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ProtectedLayout() {
  const isAuthPage = useIsAuthPage();
  const router = useRouter();
  const { isAuthenticated } = useSupabase();

  useEffect(() => {
    if (isAuthenticated && isAuthPage) {
      router.push("/");
    }
  }, [isAuthenticated, isAuthPage]);

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

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
          // headerShown: false,
        }}
      />
    </Stack>
  );
}

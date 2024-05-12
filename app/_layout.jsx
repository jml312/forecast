import { Slot } from "expo-router";
import "../global.css";
import { SupabaseProvider } from "@/contexts/supabase";
import { Fragment } from "react";
import { AuthLayout } from "@/components/layouts";
import { useIsAuthPage } from "@/hooks";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const isAuthPage = useIsAuthPage();

  const Layout = isAuthPage ? AuthLayout : Fragment;

  return (
    <SupabaseProvider>
      <SafeAreaProvider>
        <Layout>
          <Slot />
        </Layout>
      </SafeAreaProvider>
    </SupabaseProvider>
  );
}

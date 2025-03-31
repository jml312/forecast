import { Slot } from "expo-router";
import "../global.css";
import { SupabaseProvider, ThemeProvider } from "@/contexts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Slot />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  );
}

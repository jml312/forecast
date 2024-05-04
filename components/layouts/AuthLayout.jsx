import { StatusBar } from "expo-status-bar";
import { Link, usePathname } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/theme";
import { useColorScheme } from "nativewind";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  let pageHeader,
    pageDescription,
    linkDescription = "Have an account?",
    linkTitle = "Sign in",
    linkHref = "/sign-in";
  switch (pathname) {
    case "/sign-in":
      pageHeader = "Sign in to your account";
      pageDescription = "Welcome back! Please enter your details.";
      linkDescription = "Don't have an account?";
      linkTitle = "Sign up";
      linkHref = "/sign-up";
      break;
    case "/sign-up":
      pageHeader = "Create your account";
      pageDescription = "Welcome! Please enter your details.";
      break;
    case "/forgot-password":
      pageHeader = "Forgot your password";
      pageDescription = "Enter your email to reset your password.";
      break;
  }

  return (
    <SafeAreaView
      className="flex items-center justify-between w-full h-full bg-light-bg dark:bg-dark-bg"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor:
          colorScheme === "dark"
            ? theme.extend.colors.dark.bg
            : theme.extend.colors.light.bg,
      }}
    >
      <StatusBar style="auto" />

      <View className="w-[90%] h-full">
        <View className="mt-2 mb-12">
          <Text className="text-4xl text-black dark:text-white">Forecast</Text>
        </View>

        <View>
          <Text className="text-2xl text-black dark:text-white">
            {pageHeader}
          </Text>
          <Text className="mt-1 text-gray-500 text-md dark:text-gray-400">
            {pageDescription}
          </Text>
        </View>

        {children}

        <View className="items-center justify-center w-full mb-4">
          <Text className="text-gray-500 text-md dark:text-gray-400">
            {linkDescription}&nbsp;&nbsp;
            <Link
              href={linkHref}
              className="font-semibold text-black dark:text-white"
            >
              {linkTitle}
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

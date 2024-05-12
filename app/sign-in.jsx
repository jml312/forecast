import { View, Text, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Feather, AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SocialButton, Button, Input, InfoModal } from "@/components/auth";
import { useWarmUpBrowser } from "@/hooks";
import { onSignInWithOauth, extractParamsFromUrl } from "@/utils/auth";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/theme";
import { StatusBar } from "expo-status-bar";
import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";

export default function SignInPage() {
  const redirectTo = makeRedirectUri();
  const url = Linking.useURL();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { getOAuthUrl, setSession } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [modalDetails, setModalDetails] = useState({});
  const emailRef = useRef(null);

  const validationSchema = object({
    email: string()
      .required("Please enter your email")
      .email("Please enter a valid email"),
  });

  useWarmUpBrowser();

  async function onSignInWithEmail() {
    setSignInError("");
    setLoading(true);

    try {
      await validationSchema.validate({ email }, { strict: true });
    } catch ({ path, message }) {
      if (path === "email") {
        setEmailError(message);
        emailRef.current.focus();
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setSignInError(error.message);
      setLoading(false);
      return;
    }

    setModalDetails({
      isVisible: true,
      title: "Magic Link Sent",
      bodyText: "Check your email for the magic link to sign in.",
      actionText: "Ok",
    });
    setLoading(false);
  }

  async function onEmailVerification() {
    const { accessToken, refreshToken } = extractParamsFromUrl(url);
    if (!accessToken) return;
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) return;
    router.push("/");
  }

  useEffect(() => {
    if (url) {
      onEmailVerification();
    }
  }, [url]);

  return (
    <SafeAreaView
      className="flex items-center justify-between w-full h-full bg-light-bg dark:bg-dark-bg"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: theme.extend.colors[colorScheme].bg,
      }}
    >
      <StatusBar style="auto" />

      <View className="w-[90%] h-full">
        <View className="mt-2 mb-12">
          <Text className="text-4xl text-black dark:text-white">Forecast</Text>
        </View>

        <View>
          <Text className="text-2xl text-black dark:text-white">
            Sign in to your account
          </Text>
          <Text className="mt-1 text-gray-500 text-md dark:text-gray-400">
            Welcome! Please enter your details.
          </Text>
        </View>

        <View className="mt-7 grow">
          <InfoModal
            isVisible={modalDetails.isVisible}
            title={modalDetails.title}
            bodyText={modalDetails.bodyText}
            actionText={modalDetails.actionText}
            onPress={() =>
              setModalDetails({ ...modalDetails, isVisible: false })
            }
          />
          <View>
            <Input
              label="Email"
              LeftIcon={Feather}
              leftIconName="mail"
              inputMode="email"
              inputRef={emailRef}
              colorScheme={colorScheme}
              value={email}
              setValue={(value) => setEmail(value.trim().toLowerCase())}
              error={emailError}
              setError={setEmailError}
              setPageError={setSignInError}
              disabled={loading}
            />
          </View>

          <Button
            onPress={onSignInWithEmail}
            disabled={loading}
            text="Send magic link"
            marginTop="mt-4"
          />
          {signInError && (
            <Text className="mt-2 text-lg font-semibold text-red-500 dark:text-red-400">
              {signInError}
            </Text>
          )}

          <View className="flex-row items-center justify-center w-full mb-2 -mt-1 overflow-hidden">
            <View className="w-1/2 h-[.5px] my-11 bg-dark-bg dark:bg-light-bg" />
            <Text className="mx-5 text-dark-bg dark:text-light-bg text-md">
              or
            </Text>
            <View className="w-1/2 h-[.5px] my-11 bg-dark-bg dark:bg-light-bg" />
          </View>

          <SocialButton
            onPress={() =>
              onSignInWithOauth({
                provider: "google",
                getOAuthUrl,
                setLoading,
                setSession,
                router,
              })
            }
            disabled={loading}
            Icon={AntDesign}
            iconName="google"
            text="Sign in with Google"
            colorScheme={colorScheme}
            marginTop="-mt-2.5"
            marginBottom="mb-0.5"
          />

          {Platform.OS === "ios" && (
            <SocialButton
              onPress={() =>
                onSignInWithOauth({
                  provider: "apple",
                  getOAuthUrl,
                  setLoading,
                  setSession,
                  router,
                })
              }
              disabled={loading}
              Icon={AntDesign}
              iconName="apple1"
              text="Sign in with Apple"
              colorScheme={colorScheme}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

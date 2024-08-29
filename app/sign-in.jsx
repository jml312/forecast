import { View, Text, Pressable } from "react-native";
import { useSupabase, useTheme } from "@/contexts";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SocialButton, Input } from "@/components/auth";
import { Button, BaseModal, Loader } from "@/components/common";
import { useWarmUpBrowser, useInputField } from "@/hooks";
import { onSignInWithOauth, extractParamsFromUrl, isValidInput } from "@/utils";
import { object, string } from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import { openInbox } from "react-native-email-link";

export default function SignInPage() {
  const { theme, getThemeColor } = useTheme();
  const router = useRouter();
  const {
    getOAuthUrl,
    setSession,
    setIsAuthenticated,
    setSupabaseUser,
    isAuthenticated,
    isAuthLoading,
    setIsAuthLoading,
  } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [modalDetails, setModalDetails] = useState({});
  const {
    value: email,
    setValue: setEmail,
    error: emailError,
    setError: setEmailError,
    ref: emailRef,
  } = useInputField();
  const oAuthSignInParams = {
    getOAuthUrl,
    setLoading,
    setSession,
    router,
    setIsAuthenticated,
    setSupabaseUser,
    setIsAuthLoading,
  };

  const validationSchema = object({
    email: string()
      .required("Please enter your email")
      .email("Please enter a valid email"),
  });

  useWarmUpBrowser();

  async function onSignInWithEmail() {
    setSignInError("");
    setLoading(true);

    const fields = [
      {
        name: "email",
        value: email,
        setError: setEmailError,
        ref: emailRef,
      },
    ];
    if (!(await isValidInput({ validationSchema, fields }))) {
      setLoading(false);
      return;
    }

    const redirectTo = Linking.createURL("/sign-in");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setSignInError("Too many requests. Please try again later.");
      setLoading(false);
      return;
    }

    setModalDetails({
      isVisible: true,
      title: "Magic Link Sent",
      bodyText: "Check your email to sign in.",
      actionText: "Ok",
    });
    setLoading(false);
  }

  useEffect(() => {
    Linking.addEventListener("url", async (event) => {
      const { access_token, refresh_token } = extractParamsFromUrl(event.url);
      if (isAuthenticated || !access_token || !refresh_token) return;
      setIsAuthLoading(true);
      console.log("setting session...");
      await setSession({
        access_token,
        refresh_token,
      });
      setIsAuthenticated(true);
      setSupabaseUser(access_token);
      router.push("/");
      setIsAuthLoading(false);
    });
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return <Loader />;
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
        backgroundColor: getThemeColor(
          theme.extend.colors.light.bg,
          theme.extend.colors.dark.bg
        ),
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
          <BaseModal
            isInfo
            isVisible={modalDetails.isVisible}
            title={modalDetails.title}
            bodyText={modalDetails.bodyText}
            actionText={modalDetails.actionText}
            onPress={async () => {
              setModalDetails({ ...modalDetails, isVisible: false });
              try {
                await openInbox();
              } catch {}
            }}
          />
          <View>
            <Input
              label="Email"
              LeftIcon={Feather}
              leftIconName="mail"
              inputMode="email"
              inputRef={emailRef}
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
                ...oAuthSignInParams,
              })
            }
            disabled={loading}
            Icon={AntDesign}
            iconName="google"
            text="Sign in with Google"
            marginTop="-mt-2.5"
          />

          <SocialButton
            onPress={() =>
              onSignInWithOauth({
                provider: "apple",
                ...oAuthSignInParams,
              })
            }
            disabled={loading}
            Icon={AntDesign}
            iconName="apple1"
            text="Sign in with Apple"
          />
          <Pressable
            onPress={() => router.push("/add-class")}
            disabled={loading}
            className="flex items-center justify-center mt-4"
          >
            <Text className="text-gray-500 text-md dark:text-gray-400">
              Add Class
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { View, Text, Platform } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Feather, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SocialButton, Button, Input, InfoModal } from "@/components/auth";
import { useWarmUpBrowser } from "@/hooks";
import { onSignInWithOauth } from "@/utils/auth";
import { object, string } from "yup";
import { isUser } from "@/queries/users";

export default function SignInPage() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { getOAuthUrl, setOAuthSession } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [modalDetails, setModalDetails] = useState({});
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { emailVerified, email: verifiedEmail } = useLocalSearchParams();

  const validationSchema = object({
    password: string()
      .required("Please enter your password")
      .min(6, "Password must be at least 6 characters"),
    email: string()
      .required("Please enter your email")
      .email("Please enter a valid email"),
  });

  useWarmUpBrowser();

  async function onSignInWithEmailAndPassword() {
    setLoading(true);

    try {
      await validationSchema.validate({ email, password }, { strict: true });
    } catch ({ path, message }) {
      if (path === "email") {
        setEmailError(message);
        emailRef.current.focus();
      } else if (path === "password") {
        setPasswordError(message);
        passwordRef.current.focus();
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (await isUser(email)) {
        setSignInError("Invalid password. Please try again.");
      } else if (error?.message === "Email not confirmed") {
        setSignInError("Please verify your email before signing in.");
      } else {
        setModalDetails({
          isVisible: true,
          title: "Account not found",
          bodyText: "No account was found with that email. Please sign up.",
          actionText: "Ok",
        });
        setSignInError("");
      }
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
  }

  useEffect(() => {
    if (emailVerified) {
      setModalDetails({
        isVisible: true,
        title: "Email Verified",
        bodyText: "Your email has been verified. You can now sign in.",
        actionText: "Ok",
      });
      setEmail(verifiedEmail);
      passwordRef.current.focus();
    }
  }, []);

  return (
    <View className="mt-7 grow">
      <InfoModal
        isVisible={modalDetails.isVisible}
        title={modalDetails.title}
        bodyText={modalDetails.bodyText}
        actionText={modalDetails.actionText}
        onPress={() => setModalDetails({ ...modalDetails, isVisible: false })}
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

      <View className="mt-3">
        <Input
          label="Password"
          LeftIcon={MaterialCommunityIcons}
          leftIconName="lock-outline"
          isPassword
          inputMode="password"
          inputRef={passwordRef}
          colorScheme={colorScheme}
          value={password}
          setValue={setPassword}
          error={passwordError}
          setError={setPasswordError}
          setPageError={setSignInError}
          disabled={loading}
        />

        <Button
          onPress={onSignInWithEmailAndPassword}
          disabled={loading}
          text="Sign in"
          marginTop="mt-4"
        />
        {signInError && (
          <Text className="mt-2 text-lg font-semibold text-red-500 dark:text-red-400">
            {signInError}
          </Text>
        )}

        <View className="flex-row items-center justify-between mt-3.5 -mb-1">
          <Link
            href="/forgot-password"
            className="font-semibold text-black text-md dark:text-white"
          >
            Forgot password
          </Link>
        </View>

        <View className="flex-row items-center justify-center w-full mb-2 -mt-1 overflow-hidden">
          <View className="w-1/2 h-[.5px] my-10 bg-dark-bg dark:bg-light-bg" />
          <Text className="mx-5 text-dark-bg dark:text-light-bg text-md">
            or
          </Text>
          <View className="w-1/2 h-[.5px] my-10 bg-dark-bg dark:bg-light-bg" />
        </View>

        <SocialButton
          onPress={() =>
            onSignInWithOauth({
              provider: "google",
              getOAuthUrl,
              setLoading,
              setOAuthSession,
              router,
            })
          }
          disabled={loading}
          Icon={AntDesign}
          iconName="google"
          text="Sign in with Google"
          colorScheme={colorScheme}
          marginTop="-mt-2.5"
        />

        {Platform.OS === "ios" && (
          <SocialButton
            onPress={() =>
              onSignInWithOauth({
                provider: "apple",
                getOAuthUrl,
                setLoading,
                setOAuthSession,
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
  );
}

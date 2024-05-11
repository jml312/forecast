import { View, Text, Platform } from "react-native";
import { useSupabase } from "@/contexts/supabase";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Feather, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SocialButton, Button, Input, InfoModal } from "@/components/auth";
import { object, string } from "yup";
import { useWarmUpBrowser } from "@/hooks";
import { onSignInWithOauth } from "@/utils/auth";
import * as Linking from "expo-linking";
import { isUser } from "@/queries/users";

export default function SignUpPage() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { getOAuthUrl, setOAuthSession } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [modalDetails, setModalDetails] = useState({});
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);

  const validationSchema = object({
    password: string()
      .required("Please enter your password")
      .min(6, "Password must be at least 6 characters"),
    email: string()
      .required("Please enter your email")
      .email("Please enter a valid email"),
    name: string().required("Please enter your name"),
  });

  useWarmUpBrowser();

  async function onSignInWithEmailAndPassword() {
    setLoading(true);

    try {
      await validationSchema.validate(
        { name, email, password },
        { strict: true }
      );
    } catch ({ path, message }) {
      if (path === "email") {
        setEmailError(message);
        emailRef.current.focus();
      } else if (path === "password") {
        setPasswordError(message);
        passwordRef.current.focus();
      } else {
        setNameError(message);
        nameRef.current.focus();
      }
      setLoading(false);
      return;
    }

    setEmail(email.trim().toLowerCase());
    const redirectURL = Linking.createURL(
      `sign-in?emailVerified=true&email=${email}`
    );
    const { error } = await supabase.auth.signUp({
      email: email,
      password,
      options: {
        emailRedirectTo: redirectURL,
        data: {
          first_name: name.split(" ").slice(0, -1).join(" "),
          last_name: name.split(" ").slice(-1).join(" "),
        },
      },
    });

    if (error) {
      if (await isUser(email)) {
        setSignUpError(
          "An account with this email already exists. Please sign in."
        );
      } else {
        setSignUpError("Too many requests. Please try again later.");
      }
      setLoading(false);
      return;
    }

    setModalDetails({
      isVisible: true,
      title: "Email Sent",
      bodyText:
        "An email has been sent to your inbox. Please verify your email to continue.",
      actionText: "Ok",
    });
    setLoading(false);
  }

  return (
    <>
      <InfoModal
        isVisible={modalDetails.isVisible}
        title={modalDetails.title}
        bodyText={modalDetails.bodyText}
        actionText={modalDetails.actionText}
        onPress={() => setModalDetails({ ...modalDetails, isVisible: false })}
      />

      <View className="mt-7 grow">
        <Input
          label="Name"
          placeholder={`Enter your name`}
          LeftIcon={Feather}
          leftIconName="user"
          inputMode="text"
          inputRef={nameRef}
          colorScheme={colorScheme}
          value={name}
          setValue={setName}
          error={nameError}
          setError={setNameError}
          setPageError={setSignUpError}
          disabled={loading}
        />
        <View className="mt-3">
          <Input
            label="Email"
            LeftIcon={Feather}
            leftIconName="mail"
            inputMode="text"
            inputRef={emailRef}
            colorScheme={colorScheme}
            value={email}
            setValue={setEmail}
            error={emailError}
            setError={setEmailError}
            setPageError={setSignUpError}
            disabled={loading}
          />
        </View>

        <View className="mt-3">
          <Input
            isPassword
            label="Password"
            LeftIcon={MaterialCommunityIcons}
            leftIconName="lock-outline"
            inputMode="password"
            inputRef={passwordRef}
            colorScheme={colorScheme}
            value={password}
            setValue={setPassword}
            error={passwordError}
            setError={setPasswordError}
            setPageError={setSignUpError}
            disabled={loading}
          />

          <Button
            onPress={onSignInWithEmailAndPassword}
            disabled={loading}
            text="Sign up"
          />
          {signUpError && (
            <Text className="mt-2 -mb-2 text-lg font-semibold text-red-500 dark:text-red-400">
              {signUpError}
            </Text>
          )}

          <View className="flex-row items-center justify-center w-full mb-2 overflow-hidden">
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
            text="Sign up with Google"
            colorScheme={colorScheme}
            marginTop="-mt-2"
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
              text="Sign up with Apple"
              colorScheme={colorScheme}
            />
          )}
        </View>
      </View>
    </>
  );
}

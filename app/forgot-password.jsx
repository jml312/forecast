import { View, Text } from "react-native";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Input, Button, InfoModal } from "@/components/auth";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { object, string } from "yup";
import * as Linking from "expo-linking";
import { isUser } from "@/queries/users";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const emailRef = useRef(null);
  const { colorScheme } = useColorScheme();

  const validationSchema = object({
    email: string().email().required(),
  });

  const onResetPassword = async () => {
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

    const hasAccount = await isUser(email);

    if (!hasAccount) {
      setForgotPasswordError("No user was found with that email.");
      setLoading(false);
      return;
    }

    const redirectURL = Linking.createURL("/update-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL,
    });

    if (error) {
      setForgotPasswordError(error.message);
      setLoading(false);
      return;
    }

    setModalDetails({
      isVisible: true,
      title: "Email Sent",
      bodyText: "Please check your email to reset your password.",
      actionText: "Ok",
    });
    setLoading(false);
  };

  return (
    <View className="mt-7 grow">
      <InfoModal
        isVisible={modalDetails.isVisible}
        title={modalDetails.title}
        bodyText={modalDetails.bodyText}
        actionText={modalDetails.actionText}
        onPress={() => setModalDetails({ ...modalDetails, isVisible: false })}
      />

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
        disabled={loading}
        setPageError={setForgotPasswordError}
      />

      <Button
        onPress={onResetPassword}
        disabled={loading}
        text="Reset Password"
        marginTop="mt-4"
      />
      {forgotPasswordError && (
        <Text className="mt-2 -mb-2 text-lg font-semibold text-red-500 dark:text-red-400">
          {forgotPasswordError}
        </Text>
      )}
    </View>
  );
}

import { View, Text } from "react-native";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Input, Button, InfoModal } from "@/components/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { object, string, ref } from "yup";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [updatePasswordError, setUpdatePasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { colorScheme } = useColorScheme();

  const validationSchema = object({
    confirmPassword: string()
      .required("Please confirm your password")
      .oneOf([ref("password")],
    password: string()
      .required("Please enter your password")
      .min(6, "Password must be at least 6 characters"),
     "Passwords must match")
  });

  const onUpdatePassword = async () => {
    setLoading(true);

    try {
      await validationSchema.validate(
        {
          password,
          confirmPassword,
        },
        { strict: true }
      );
    } catch ({ path, message }) {
      if (path === "password") {
        setPasswordError(message);
        passwordRef.current.focus();
      } else if (path === "confirmPassword") {
        setConfirmPasswordError(message);
        confirmPasswordRef.current.focus();
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setUpdatePasswordError(error.message);
      setLoading(false);
      return;
    }

    setModalDetails({
      isVisible: true,
      title: "Password Updated",
      bodyText: "Your password has been updated successfully. Please sign in.",
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
        setPageError={setUpdatePasswordError}
        disabled={loading}
      />

      <View className="mt-3">
        <Input
          isPassword
          placeholder={`Enter your password again`}
          label="Confirm Password"
          LeftIcon={MaterialCommunityIcons}
          leftIconName="lock-outline"
          inputMode="password"
          inputRef={confirmPasswordRef}
          colorScheme={colorScheme}
          value={confirmPassword}
          setValue={setConfirmPassword}
          error={confirmPasswordError}
          setError={setConfirmPasswordError}
          setPageError={setUpdatePasswordError}
          disabled={loading}
        />
      </View>

      <Button
        onPress={onUpdatePassword}
        disabled={loading}
        text="Reset Password"
        marginTop="mt-4"
      />
      {updatePasswordError && (
        <Text className="mt-2 -mb-2 text-lg font-semibold text-red-500 dark:text-red-400">
          {updatePasswordError}
        </Text>
      )}
    </View>
  );
}

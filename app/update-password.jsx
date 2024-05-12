import { View, Text } from "react-native";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input, Button, InfoModal } from "@/components/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { object, string, ref } from "yup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSupabase } from "@/contexts/supabase";
import { getUserByEmail } from "@/queries/users";

export default function UpdatePassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
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
  const { isAuthenticated } = useSupabase();

  const validationSchema = object({
    confirmPassword: string()
      .required("Please confirm your password")
      .oneOf([ref("password")], "Passwords do not match"),
    password: string()
      .required("Please enter your password")
      .min(6, "Password must be at least 6 characters"),
  });

  const onUpdatePassword = async () => {
    setUpdatePasswordError("");
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

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    console.log("error", error, error.message);

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

  useEffect(() => {
    (async () => {
      if (email) {
        const data = await getUserByEmail(email);

        if (!data?.id) {
          router.push("/sign-in");
        }

        setUserId(data.id);
      }
    })();
  }, []);

  return (
    <View className="mt-7 grow">
      <InfoModal
        isVisible={modalDetails.isVisible}
        title={modalDetails.title}
        bodyText={modalDetails.bodyText}
        actionText={modalDetails.actionText}
        onPress={() => {
          setModalDetails({ ...modalDetails, isVisible: false });
          router.push("/sign-in");
        }}
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
        autoFocus={true}
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

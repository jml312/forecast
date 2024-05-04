import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Input({
  label,
  LeftIcon,
  leftIconName,
  isPassword,
  inputMode,
  inputRef,
  colorScheme,
  value,
  setValue,
  error,
  setError,
  setPageError,
  disabled,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Text className="mb-1 text-black text-md dark:text-white">{label}</Text>
      <View className="flex flex-row items-center justify-center p-2 border-2 border-gray-200 rounded-md bg-light-input dark:bg-dark-input dark:border-gray-700">
        <LeftIcon
          name={leftIconName}
          size={20}
          color={
            colorScheme === "dark"
              ? "rgba(156, 163, 175, 1)"
              : "rgba(107, 114, 128 1)"
          }
        />
        <TextInput
          placeholder={`Enter your ${label.toLowerCase()}`}
          value={value}
          onChangeText={(val) => {
            setError("");
            setPageError("");
            setValue(val);
          }}
          disabled={disabled}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          secureTextEntry={isPassword && !showPassword}
          inputMode={isPassword ? "password" : inputMode}
          ref={inputRef}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="ml-auto"
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={
                colorScheme === "dark"
                  ? "rgba(156, 163, 175, 1)"
                  : "rgba(107, 114, 128 1)"
              }
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="mt-1 text-red-500 text-md dark:text-red-400">
          {error}
        </Text>
      )}
    </>
  );
}

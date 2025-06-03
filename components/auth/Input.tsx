import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts";

export default function Input({
  label,
  placeholder,
  LeftIcon,
  leftIconName,
  isPassword,
  inputMode,
  inputRef,
  value,
  setValue,
  error,
  setError,
  disabled,
  autoFocus,
}) {
  const { theme, getThemeColor } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  placeholder = placeholder || `Enter your ${label.toLowerCase()}`;

  return (
    <>
      <Text className="mb-1 text-black text-md dark:text-white">{label}</Text>
      <View className="flex flex-row items-center justify-center p-2 bg-white border-2 border-gray-400 rounded-md dark:bg-black dark:border-gray-700">
        <LeftIcon
          name={leftIconName}
          size={20}
          color={getThemeColor(
            theme.extend.colors.light.muted,
            theme.extend.colors.dark.muted
          )}
        />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(val) => {
            setError("");
            setValue(val);
          }}
          editable={!disabled}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          secureTextEntry={isPassword && !showPassword}
          inputMode={isPassword ? "password" : inputMode}
          ref={inputRef}
          autoCapitalize={label === "Name" && "words"}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect={false}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="ml-auto"
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={getThemeColor(
                theme.extend.colors.light.muted,
                theme.extend.colors.dark.muted
              )}
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

import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts";

export default function Input({
  label,
  placeholder,
  LeftIcon,
  leftIconName,
  error,
  value,
  setValue,
  setError,
  setPageError = () => {},
  disabled,
  inputRef,
  inputMode,
  autoFocus = false,
  required = false,
  containerClassNames,
  width,
  maxLength,
  minLength,
}) {
  const { theme, getThemeColor } = useTheme();
  return (
    <View containerClassName={containerClassNames} style={{ width: width }}>
      {label && (
        <Text className="mb-1 text-black text-md dark:text-white">
          {label + (required ? " *" : "")}
        </Text>
      )}
      <View className="flex flex-row items-center justify-center p-2 bg-white border-2 border-gray-400 rounded-md dark:bg-black dark:border-gray-700">
        {LeftIcon && (
          <LeftIcon
            name={leftIconName}
            size={20}
            color={getThemeColor(
              theme.extend.colors.light.muted,
              theme.extend.colors.dark.muted
            )}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(val) => {
            if (val.length < minLength || val.length > maxLength) return;
            setError("");
            setPageError("");
            setValue(val);
          }}
          editable={!disabled}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          keyboardType={inputMode}
          inputMode={inputMode}
          ref={inputRef}
          autoFocus={autoFocus}
        />
      </View>
      {error && (
        <Text className="mt-1 text-red-500 text-md dark:text-red-400">
          {error}
        </Text>
      )}
    </View>
  );
}

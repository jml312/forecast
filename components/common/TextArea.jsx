import { View, TextInput, Text } from "react-native";
import { useTheme } from "@/contexts";

export default function TextArea({
  label,
  placeholder,
  error,
  value,
  setValue,
  setError,
  setPageError = () => {},
  disabled,
  inputRef,
  autoFocus = false,
  required = false,
  containerClassNames,
  width,
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
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(val) => {
            setError("");
            setPageError("");
            setValue(val);
          }}
          editable={!disabled}
          multiline
          numberOfLines={4}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-20"
          inputMode="text"
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

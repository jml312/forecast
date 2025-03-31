import { Pressable, Text, View } from "react-native";
import { clsx } from "clsx";

export default function ButtonInput({
  label,
  placeholder,
  required = false,
  value,
  onPress,
  width = "100%",
  disabled,
  error,
  setError,
}) {
  return (
    <View
      style={{
        width: width,
      }}
    >
      {label && (
        <Text className="mb-1 text-black text-md dark:text-white">
          {label + (required ? " *" : "")}
        </Text>
      )}
      <View
        className={clsx(
          "flex flex-row items-center justify-center p-2 border-2 border-gray-400 rounded-md dark:border-gray-700",
          !disabled
            ? "bg-white dark:bg-black"
            : "bg-light-input dark:bg-dark-input"
        )}
      >
        <Pressable
          onPress={() => {
            setError && setError("");
            onPress();
          }}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400"
        >
          <Text className="text-gray-500 dark:text-gray-400">
            {value?.toString() || placeholder?.toString()}
          </Text>
        </Pressable>
      </View>
      {error && (
        <Text className="mt-1 text-red-500 text-md dark:text-red-400">
          {error}
        </Text>
      )}
    </View>
  );
}

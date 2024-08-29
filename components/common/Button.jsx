import { Pressable, Text } from "react-native";
import { clsx } from "clsx";

export default function Button({
  onPress,
  disabled,
  text,
  marginTop = "mt-8",
  invertColor = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center w-full py-4 rounded-md",
        marginTop,
        invertColor
          ? "dark:bg-dark-bg bg-light-bg"
          : "bg-dark-bg dark:bg-light-bg"
      )}
    >
      <Text
        className={clsx(
          "font-semibold text-md",
          invertColor
            ? "text-black dark:text-white"
            : "text-white dark:text-black"
        )}
      >
        {text}
      </Text>
    </Pressable>
  );
}

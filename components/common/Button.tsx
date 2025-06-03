import { Pressable, Text, View } from "react-native";
import { clsx } from "clsx";
import Loader from "./Loader";

export default function Button({
  onPress,
  disabled,
  text,
  marginTop = "mt-8",
  invertColor = false,
  loading,
  withLoading = true,
  Icon,
  classNames,
  width = "w-full",
  textClassName = "font-semibold text-md",
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center rounded-md",
        marginTop,
        invertColor && "dark:bg-dark-bg bg-light-bg",
        !invertColor && "bg-dark-bg dark:bg-light-bg",
        withLoading && (loading ? "py-[1.625rem]" : "py-4"),
        width,
        classNames
      )}
    >
      {loading ? (
        <Loader swapTheme={invertColor} size={30} />
      ) : (
        <View className="flex-row items-center justify-center w-full gap-2">
          {Icon ? Icon : null}
          <Text
            className={clsx(
              invertColor && "text-black dark:text-white",
              !invertColor && "text-white dark:text-black",
              textClassName
            )}
          >
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

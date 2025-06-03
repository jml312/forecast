import { Switch as RnSwitch, View, Text } from "react-native";
import { useTheme } from "@/contexts";
import clsx from "clsx";

export default function Switch({
  value,
  onValueChange,
  className,
  scale,
  label,
  showValue = false,
  onText,
  offText,
  containerClassName,
  flip = false,
  gap = "gap-1",
  switchContainerClassName,
}) {
  const { getThemeColor } = useTheme();

  return (
    <View
      className={clsx(
        "flex flex-col items-start justify-center",
        containerClassName
      )}
    >
      {label && (
        <Text
          className="mb-2 text-black dark:text-white"
          style={{ fontSize: 16 }}
        >
          {label}
        </Text>
      )}
      <View
        className={clsx(
          "flex flex-row items-center justify-center",
          gap,
          switchContainerClassName
        )}
      >
        {showValue && !flip && (
          <Text className="text-black dark:text-white" style={{ fontSize: 16 }}>
            {value === true ? onText : offText}
          </Text>
        )}
        <RnSwitch
          value={value}
          onValueChange={onValueChange}
          thumbColor={getThemeColor("#000000", "#FFFFFF")}
          trackColor={{
            false: getThemeColor("#B3B3B3", "#5A5A5A"),
            true: getThemeColor("#B3B3B3", "#5A5A5A"),
          }}
          ios_backgroundColor={getThemeColor("#B3B3B3", "#5A5A5A")}
          className={className}
          style={{ transform: [{ scaleX: scale }, { scaleY: scale }] }}
        />
        {showValue && flip && (
          <Text className="text-black dark:text-white" style={{ fontSize: 16 }}>
            {value === true ? onText : offText}
          </Text>
        )}
      </View>
    </View>
  );
}

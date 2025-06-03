import clsx from "clsx";
import { Text as RNText } from "react-native";

export default function Text({ children, invertColor, className, ...props }) {
  return (
    <RNText
      {...props}
      className={clsx(
        invertColor
          ? "text-white dark:text-black"
          : "text-black dark:text-white",
        className
      )}
    >
      {children}
    </RNText>
  );
}

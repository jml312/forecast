import { useTheme } from "@/contexts";
import { BarIndicator } from "react-native-indicators";

export default function Loader({ size, swapTheme }) {
  const { getThemeColor } = useTheme();

  return (
    <BarIndicator
      color={
        swapTheme
          ? getThemeColor("black", "white")
          : getThemeColor("white", "black")
      }
      count={4}
      size={size}
    />
  );
}

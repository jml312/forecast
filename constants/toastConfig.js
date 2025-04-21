import { BaseToast, ErrorToast } from "react-native-toast-message";
import { useTheme } from "@/contexts";

export const toastConfig = {
  success: (props) => {
    const { getThemeColor } = useTheme();
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: getThemeColor("#22c55e", "#16a34a"),
          backgroundColor: getThemeColor("white", "black"),
        }}
        text1Style={{
          color: getThemeColor("black", "white"),
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          color: getThemeColor("black", "white"),
          fontSize: 14,
        }}
      />
    );
  },
  error: (props) => {
    const { getThemeColor } = useTheme();
    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: getThemeColor("#ef4444", "#dc2626"),
          backgroundColor: getThemeColor("white", "black"),
        }}
        text1Style={{
          color: getThemeColor("black", "white"),
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          color: getThemeColor("black", "white"),
          fontSize: 14,
        }}
      />
    );
  },
};

export const baseSuccessToast = {
  type: "success",
  text1: "Success",
  position: "bottom",
  visibilityTime: 4000,
  autoHide: true,
};

export const baseErrorToast = {
  type: "error",
  text1: "Error",
  position: "bottom",
  visibilityTime: 4000,
  autoHide: true,
};

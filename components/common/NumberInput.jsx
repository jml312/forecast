import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts";

export default function NumberInput({
  label,
  placeholder,
  LeftIcon,
  leftIconName,
  value,
  setValue,
  setPageError = () => {},
  disabled,
  inputRef,
  autoFocus = false,
  required = false,
  containerClassNames,
  width,
  minValue,
  maxValue,
}) {
  const { theme, getThemeColor } = useTheme();

  const cleanAndValidateNumber = (input) => {
    input = input.trim().replace(/[^0-9.]/g, "");

    if (input.length >= 2 && input.at(0) === "0" && input.at(1) !== ".") {
      input = input.replace(/^0+/, "");
      if (!input.length) {
        input = "0";
      }
    }

    // Limit decimal places to two
    const decimalIndex = input.indexOf(".");
    if (decimalIndex !== -1) {
      input = input.slice(0, decimalIndex + 3);
    }

    if (input.endsWith(".") || /\d+\.\d0/.test(input)) {
      input = input.slice(0, -1);
    }

    if (input.endsWith(".0") || input.endsWith(".00")) {
      input = input.split(".")[0];
    }

    const num = parseFloat(input);
    return isNaN(num) || num < minValue || num > minValue
      ? input
      : num.toString();
  };

  return (
    <View containerClassName={containerClassNames} style={{ width: width }}>
      {label && (
        <Text className="mb-1 text-black text-md dark:text-white">
          {label + (required ? " *" : "")}
        </Text>
      )}
      <View className="flex flex-row items-center justify-center p-2 border-2 border-gray-400 rounded-md bg-white dark:bg-black dark:border-gray-700">
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
          value={value.toString()}
          maxLength={5}
          onBlur={() => {
            const cleanValue = cleanAndValidateNumber(value);
            setPageError("");
            setValue(cleanValue);
          }}
          onChangeText={(val) => {
            const parsedValue = parseInt(val);

            if (isNaN(val) || parsedValue > maxValue || parsedValue < minValue)
              return;

            if (/^[1-9]\.\d+$/.test(val) && val.length > 4) {
              val = val.slice(0, 4);
            }

            setPageError("");
            setValue(val);
          }}
          disabled={disabled}
          className="py-[5px] ml-2 mr-1 text-gray-500 grow dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          keyboardType={"decimal"}
          inputMode={"decimal"}
          ref={inputRef}
          autoCapitalize={"words"}
          autoFocus={autoFocus}
        />
      </View>
    </View>
  );
}

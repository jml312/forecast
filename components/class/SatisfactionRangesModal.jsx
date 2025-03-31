import { useState, useMemo, useEffect } from "react";
import { View, Text } from "react-native";
import { BaseModal, ButtonInput, SelectModal } from "@/components/common";
import { satisfactionRanges } from "@/constants/satisfactionRanges";

export default function SatisfactionRangesModal({
  sunnyValue,
  setSunnyValue,
  partlySunnyValue,
  setPartlySunnyValue,
  cloudyValue,
  setCloudyValue,
  rainyValue,
  setRainyValue,
  isSatisfactionVisible,
  setIsSatisfactionVisible,
  loading,
  resetSatisfactionRanges,
}) {
  const satisfactionRangeData = [
    {
      label: "Sunny 🌤️",
      title: "Sunny",
      value: sunnyValue,
      setValue: setSunnyValue,
      isUpperReadOnly: true,
    },
    {
      label: "Partly Sunny ⛅",
      title: "Partly Sunny",
      value: partlySunnyValue,
      setValue: setPartlySunnyValue,
    },
    {
      label: "Cloudy ☁️",
      title: "Cloudy",
      value: cloudyValue,
      setValue: setCloudyValue,
    },
    {
      label: "Rainy 🌧️",
      title: "Rainy",
      value: rainyValue,
      setValue: setRainyValue,
      isLowerReadOnly: true,
    },
  ];
  const [isRangeError, setIsRangeError] = useState(false);
  const gradeRange = useMemo(
    () =>
      Array.from({ length: 101 })
        .map((_, i) => ({
          label: `${i}`,
          value: i,
        }))
        .reverse(),
    []
  );
  
  const isSatisfactionRangesChanged =
    sunnyValue.low !== satisfactionRanges.sunny.low ||
    sunnyValue.high !== satisfactionRanges.sunny.high ||
    partlySunnyValue.low !== satisfactionRanges.partlySunny.low ||
    partlySunnyValue.high !== satisfactionRanges.partlySunny.high ||
    cloudyValue.low !== satisfactionRanges.cloudy.low ||
    cloudyValue.high !== satisfactionRanges.cloudy.high ||
    rainyValue.low !== satisfactionRanges.rainy.low ||
    rainyValue.high !== satisfactionRanges.rainy.high;

  return (
    <BaseModal
      isVisible={isSatisfactionVisible}
      actionText={"Done"}
      title="Satisfaction Ranges"
      onPress={() => {
        const isValidRanges =
          rainyValue.high === cloudyValue.low &&
          cloudyValue.high === partlySunnyValue.low &&
          partlySunnyValue.high === sunnyValue.low;
        if (!isValidRanges) {
          setIsRangeError(true);
          return;
        }
        setIsSatisfactionVisible(false);
        setIsRangeError(false);
      }}
      buttonMarginTop="mt-[1.1rem]"
      RightIcon={
        isSatisfactionRangesChanged && (
          <Text
            className="text-black dark:text-white"
            onPress={() => {
              resetSatisfactionRanges();
              setIsRangeError(false);
            }}
          >
            Reset
          </Text>
        )
      }
      bottomError={
        isRangeError &&
        "Invalid satisfaction ranges. Adjust the values or press reset to restore defaults."
      }
    >
      <View className="flex items-start justify-center w-full gap-4 mb-2 mt-0.5">
        {satisfactionRangeData.map(({ label, ...data }) => (
          <RangeRow
            key={label}
            {...data}
            label={label}
            isSatisfactionRangesChanged={isSatisfactionRangesChanged}
            gradeRange={gradeRange}
            loading={loading}
            setIsRangeError={setIsRangeError}
          />
        ))}
      </View>
    </BaseModal>
  );
}

function RangeRow({ label, isLowerReadOnly, isUpperReadOnly, ...rest }) {
  return (
    <View>
      <Text className="mb-1 text-lg text-black dark:text-white">{label}</Text>
      <View className="flex-row items-center justify-between w-full">
        {/* from */}
        {isLowerReadOnly ? (
          <>
            <ButtonInput width="45%" value={rest.value.low} disabled />
            <Text className="font-light text-black text-md dark:text-white">
              to
            </Text>
          </>
        ) : (
          <RangeInput withSeparator isLower {...rest} />
        )}

        {/* to */}
        {isUpperReadOnly ? (
          <ButtonInput width="45%" value={rest.value.high} disabled />
        ) : (
          <RangeInput {...rest} />
        )}
      </View>
    </View>
  );
}

function RangeInput({
  value,
  setValue,
  loading,
  title,
  gradeRange,
  isLower,
  withSeparator,
  isSatisfactionRangesChanged,
  setIsRangeError,
}) {
  const [selectDetails, setSelectDetails] = useState({
    open: false,
    label: "",
  });
  const [currentValue, setCurrentValue] = useState(
    isLower ? value?.low : value?.high
  );

  const onClose = () => {
    if (isLower) {
      const highValue = value.high < currentValue ? currentValue : value.high;
      setValue({
        high: highValue, // only change if the value is lower
        low: currentValue,
      });
      setCurrentValue(highValue);
    } else {
      const lowValue = value.low > currentValue ? currentValue : value.low;
      setValue({
        high: currentValue,
        low: lowValue, // only change if the value is higher
      });
      setCurrentValue(lowValue);
    }
  };

  useEffect(() => {
    setCurrentValue(isLower ? value?.low : value?.high);
  }, [value]);

  useEffect(() => {
    if (!isSatisfactionRangesChanged) {
      setCurrentValue(isLower ? value?.low : value?.high);
    }
  }, [isSatisfactionRangesChanged, value, isLower]);

  return (
    <>
      <ButtonInput
        width="45%"
        value={isLower ? value?.low : value?.high}
        onPress={() => {
          if (loading) return;
          setSelectDetails({
            open: true,
            label: `${title} ${isLower ? "Minimum" : "Maximum"}`,
          });
          setIsRangeError(false);
        }}
      />
      <SelectModal
        disabled={loading}
        value={currentValue}
        setValue={setCurrentValue}
        isSelectVisible={selectDetails.open}
        setIsSelectVisible={() =>
          setSelectDetails({ ...selectDetails, open: !selectDetails.open })
        }
        label={selectDetails.label}
        items={gradeRange}
        onClose={onClose}
      />
      {withSeparator && (
        <Text className="font-light text-black text-md dark:text-white">
          to
        </Text>
      )}
    </>
  );
}

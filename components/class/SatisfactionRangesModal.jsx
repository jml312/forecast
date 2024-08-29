import { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { BaseModal, ButtonInput, SelectModal } from "@/components/common";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const setValue = ({
    newVal,
    currVal,
    setFn,
    isLower = true,
    isValue = true,
  }) => {
    const valueKey = isValue ? "value" : "selectValue";
    setFn({
      higher: {
        ...currVal.higher,
        [valueKey]: isLower ? currVal.higher.value : newVal,
      },
      lower: {
        ...currVal.lower,
        [valueKey]: isLower ? newVal : currVal.lower.value,
      },
    });
  };

  return (
    <BaseModal
      isVisible={isSatisfactionVisible}
      actionText={"Done"}
      title="Satisfaction Ranges"
      onPress={() => {
        setIsSatisfactionVisible(false);
      }}
      buttonMarginTop="mt-[1.1rem]"
      RightIcon={
        <MaterialCommunityIcons
          name="restart"
          size={24}
          onPress={resetSatisfactionRanges}
        />
      }
    >
      <View className="flex items-start justify-center w-full gap-4 mb-2 mt-0.5">
        {/* Sunny */}
        <RangeRow label="Sunny 🌤️">
          <RangeInput
            isLower
            withSeparator
            label="Sunny 🌤️"
            loading={loading}
            value={sunnyValue}
            setValue={setValue}
            setFn={setSunnyValue}
          />

          <RangeInput
            value={sunnyValue}
            disabled
            label="Sunny 🌤️"
            loading={loading}
          />
        </RangeRow>

        {/* Partly Sunny */}
        <RangeRow label="Partly Sunny ⛅">
          <RangeInput
            value={partlySunnyValue}
            setValue={setValue}
            setFn={setPartlySunnyValue}
            isLower
            withSeparator
            label="Partly Sunny ⛅"
            loading={loading}
          />

          <RangeInput
            value={partlySunnyValue}
            setValue={setValue}
            setFn={setPartlySunnyValue}
            label="Partly Sunny ⛅"
            loading={loading}
          />
        </RangeRow>

        {/* Cloudy */}
        <RangeRow label="Cloudy ☁️">
          <RangeInput
            value={cloudyValue}
            setValue={setValue}
            setFn={setCloudyValue}
            isLower
            withSeparator
            label="Cloudy ☁️"
            loading={loading}
          />

          <RangeInput
            value={cloudyValue}
            setValue={setValue}
            setFn={setCloudyValue}
            label="Cloudy ☁️"
            loading={loading}
          />
        </RangeRow>

        {/* Rainy */}
        <RangeRow label="Rainy 🌧️">
          <RangeInput
            value={rainyValue}
            withSeparator
            disabled
            isLower
            label="Rainy 🌧️"
            loading={loading}
          />

          <RangeInput
            value={rainyValue}
            setValue={setValue}
            setFn={setRainyValue}
            label="Rainy 🌧️"
            loading={loading}
          />
        </RangeRow>
      </View>
    </BaseModal>
  );
}

function RangeRow({ label, children }) {
  return (
    <View>
      <Text className="mb-1 text-lg text-black dark:text-white">{label}</Text>
      <View className="flex-row items-center justify-between w-full">
        {children}
      </View>
    </View>
  );
}

function RangeInput({
  value,
  setValue,
  setFn,
  loading,
  label,
  isLower,
  withSeparator,
  updateOtherRanges,
}) {
  const [selectDetails, setSelectDetails] = useState({
    open: false,
    label: "",
  });

  const generateRange = useCallback((min, max) => {
    return Array.from({ length: max - min + 1 }, (_, i) => ({
      label: `${min + i}`,
      value: min + i,
    })).reverse();
  }, []);

  const currentValue = isLower ? value.lower : value.higher;
  const disabled = currentValue?.isDisabled;

  return (
    <>
      <ButtonInput
        width="45%"
        disabled={disabled}
        value={currentValue?.value}
        onPress={() => {
          if (loading || disabled) return;
          setSelectDetails({
            open: true,
            label: `${label} ${isLower ? "min" : "max"}`,
          });
        }}
      />
      <SelectModal
        disabled={loading}
        value={currentValue?.selectValue}
        setValue={(val) => {
          setValue({
            setFn,
            newVal: val,
            currVal: value,
            isValue: false,
            isLower,
          });
        }}
        isSelectVisible={selectDetails.open}
        setIsSelectVisible={() =>
          setSelectDetails({ ...selectDetails, open: !selectDetails.open })
        }
        label={selectDetails.label}
        items={generateRange(currentValue?.min, currentValue?.max)}
        onClose={() => {
          const val = currentValue?.selectValue;
          setValue({
            setFn,
            newVal: val,
            currVal: value,
            isLower,
          });
          // updateOtherRanges && updateOtherRanges(val);
        }}
      />
      {withSeparator && (
        <Text className="font-light text-black text-md dark:text-white">
          to
        </Text>
      )}
    </>
  );
}

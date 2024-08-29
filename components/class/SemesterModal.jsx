import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/contexts";
import { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import {
  SelectModal,
  ButtonInput,
  InputDatePicker,
  BaseModal,
} from "@/components/common";
import { clsx } from "clsx";
import { useInputField, useDateRange } from "@/hooks";

export function SemesterModal({
  value,
  setValue,
  items,
  required = false,
  placeholder,
  disabled,
  label,
  isSelectVisible,
  setIsSelectVisible,
}) {
  const { getThemeColor } = useTheme();
  const [isAddSemesterVisible, setIsAddSemesterVisible] = useState(false);
  return (
    <>
      <AddSemesterModal
        isVisible={isAddSemesterVisible}
        setIsVisible={setIsAddSemesterVisible}
      />
      <SelectModal
        isSelectVisible={isSelectVisible}
        setIsSelectVisible={setIsSelectVisible}
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        label={label}
        items={items}
        disabled={disabled}
        required={required}
        missingItemsText={"No semesters found"}
        AddMoreComponent={() => (
          <Pressable
            className={clsx(
              "flex-row items-center justify-center w-full gap-1.5 p-4"
            )}
            onPress={() => {
              setIsSelectVisible(false);
              setTimeout(() => {
                setIsAddSemesterVisible(true);
              }, 350);
            }}
          >
            <View className="flex-row items-center justify-start gap-1.5 -ml-1.5 mt-1">
              <EvilIcons
                name="plus"
                size={28}
                color={getThemeColor("black", "white")}
              />
              <Text className="text-lg text-black dark:text-white">
                Add Semester
              </Text>
            </View>
          </Pressable>
        )}
      />
    </>
  );
}

export function AddSemesterModal({ isVisible, setIsVisible }) {
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    value: semesterSeason,
    setValue: setSemesterSeason,
    error: semesterSeasonError,
    setError: setSemesterSeasonError,
    ref: semesterSeasonRef,
  } = useInputField();
  const { startDate, setStartDate, endDate, setEndDate } = useDateRange();

  return (
    <BaseModal
      isVisible={isVisible}
      actionText={"Add Semester"}
      title="Add A Semester"
      onPress={() => {
        setIsVisible(false);
      }}
    >
      <View className="flex items-center justify-center w-full gap-4">
        <ButtonInput
          label="Season"
          value={semesterSeason}
          placeholder="Select a season"
          disabled={loading}
          required
          onPress={() => {
            if (loading) return;
            setIsSelectVisible(true);
          }}
        />
        <SelectModal
          disabled={loading}
          value={semesterSeason}
          setValue={setSemesterSeason}
          required
          isSelectVisible={isSelectVisible}
          setIsSelectVisible={setIsSelectVisible}
          placeholder={"Select a season"}
          label={"Season"}
          items={["Fall", "Spring", "Summer", "Winter"]}
        />
        <View className="flex-row items-start justify-between w-full">
          <InputDatePicker
            date={startDate}
            setDate={setStartDate}
            mode="date"
            title="Start Date"
            width="47%"
            disabled={loading}
            required
          />
          <InputDatePicker
            date={endDate}
            setDate={setEndDate}
            mode="date"
            title="End Date"
            width="47%"
            disabled={loading}
            required
          />
        </View>
      </View>
    </BaseModal>
  );
}

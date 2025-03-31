import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/contexts";
import { useState, useMemo, useEffect } from "react";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import {
  SelectModal,
  ButtonInput,
  InputDatePicker,
  BaseModal,
} from "@/components/common";
import { clsx } from "clsx";
import { useInputField, useDateRange } from "@/hooks";
import { format, compareAsc } from "date-fns";

const parseSemesterString = (semesterString) => {
  const [season, startDate, endDate] = semesterString.split("|");
  return {
    season,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };
};

const stringifySemester = (semester) => {
  return `${semester.season}|${semester.startDate}|${semester.endDate}`;
};

export function SemesterModal({
  value,
  setValue,
  items,
  setItems,
  required = false,
  placeholder,
  disabled,
  label,
  isSelectVisible,
  setIsSelectVisible,
}) {
  const { getThemeColor } = useTheme();
  const [isAddSemesterVisible, setIsAddSemesterVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    !!value?.season ? stringifySemester(value) : null
  );

  const sortedItems = useMemo(
    () =>
      items?.sort(({ value: aValue }, { value: bValue }) => {
        const a = parseSemesterString(aValue);
        const b = parseSemesterString(bValue);
        const aDate = format(new Date(a.startDate), "yyyy-MM-dd");
        const bDate = format(new Date(b.startDate), "yyyy-MM-dd");
        const dateComparison = compareAsc(aDate, bDate);
        if (dateComparison !== 0) return dateComparison;
        const seasonOrder = { Fall: 1, Winter: 2, Spring: 3, Summer: 4 };
        return seasonOrder[a.season] - seasonOrder[b.season];
      }),

    [items]
  );

  useEffect(() => {
    if (!!value?.season) {
      setSelectedSemester(stringifySemester(value));
    }
  }, [value]);

  return (
    <>
      <AddSemesterModal
        isVisible={isAddSemesterVisible}
        setIsVisible={setIsAddSemesterVisible}
        setValue={setValue}
        setItems={setItems}
      />
      <SelectModal
        isSelectVisible={isSelectVisible}
        setIsSelectVisible={setIsSelectVisible}
        value={selectedSemester}
        setValue={setSelectedSemester}
        placeholder={placeholder}
        label={label}
        onClose={() => {
          if (!selectedSemester) return;
          setValue(parseSemesterString(selectedSemester));
        }}
        items={sortedItems}
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

export function AddSemesterModal({
  isVisible,
  setIsVisible,
  setValue,
  setItems,
}) {
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    value: semesterSeason,
    setValue: setSemesterSeason,
    error: semesterSeasonError,
    setError: setSemesterSeasonError,
    ref: semesterSeasonRef,
  } = useInputField();
  const { startDate, setStartDate, endDate, setEndDate, now } = useDateRange();
  const { getThemeColor } = useTheme();

  return (
    <BaseModal
      isVisible={isVisible}
      actionText={"Add Semester"}
      title="Add A Semester"
      RightIcon={
        <AntDesign
          name="close"
          size={18}
          onPress={() => {
            setIsVisible(false);
            setSemesterSeason("");
            setStartDate(new Date());
            setEndDate(new Date());
            setSemesterSeasonError(false);
          }}
          color={getThemeColor("black", "white")}
        />
      }
      bottomError={semesterSeasonError && "Please select a season"}
      onPress={() => {
        if (!semesterSeason) return setSemesterSeasonError(true);
        const semester = {
          season: semesterSeason,
          startDate,
          endDate,
        };
        setValue(semester);
        setItems((prev) => [
          ...prev,
          {
            label: `${semesterSeason} ${startDate.getFullYear()}`,
            value: stringifySemester(semester),
          },
        ]);
        setSemesterSeason("");
        setStartDate(new Date());
        setEndDate(new Date());
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
            setSemesterSeasonError(false);
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
          onClose={() => {
            if (!semesterSeason) {
              setSemesterSeason("Fall");
            }
          }}
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
            withResetButton
            initialValue={now}
          />
          <InputDatePicker
            date={endDate}
            setDate={setEndDate}
            mode="date"
            title="End Date"
            width="47%"
            disabled={loading}
            required
            withResetButton
            initialValue={now}
          />
        </View>
      </View>
    </BaseModal>
  );
}

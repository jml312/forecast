import { View } from "react-native";
import {
  Input,
  Button,
  PageModalHeader,
  ButtonInput,
  GradeSelect,
} from "@/components/common";
import {
  SemesterModal,
  ColorPicker,
  SatisfactionRangesModal,
} from "@/components/class";
import { useState } from "react";
import { useInputField } from "@/hooks";
import { formatSatisfactionRange, getRandomAccentColor } from "@/utils";
import { satisfactionRanges } from "@/constants/satisfactionRanges";
import { addClass } from "@/queries/classes";
import Toast from "react-native-toast-message";
import {
  toastConfig,
  baseErrorToast,
  baseSuccessToast,
} from "@/constants/toastConfig";
import { useTheme } from "@/contexts";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

export default function AddClassPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { getThemeColor } = useTheme();
  const [loading, setLoading] = useState(false);
  const {
    value: title,
    setValue: setTitle,
    error: titleError,
    setError: setTitleError,
    ref: titleRef,
  } = useInputField();
  const {
    value: semester,
    setValue: setSemester,
    error: semesterError,
    setError: setSemesterError,
  } = useInputField({
    season: "",
    year: new Date().getFullYear(),
  });
  const { value: grade, setValue: setGrade } = useInputField();
  const { value: accentColor, setValue: setAccentColor } = useInputField(
    getRandomAccentColor()
  );
  const [sunnyValue, setSunnyValue] = useState(satisfactionRanges.sunny);
  const [partlySunnyValue, setPartlySunnyValue] = useState(
    satisfactionRanges.partlySunny
  );
  const [cloudyValue, setCloudyValue] = useState(satisfactionRanges.cloudy);
  const [rainyValue, setRainyValue] = useState(satisfactionRanges.rainy);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [isSatisfactionVisible, setIsSatisfactionVisible] = useState(false);

  const resetSatisfactionRanges = () => {
    setSunnyValue(satisfactionRanges.sunny);
    setPartlySunnyValue(satisfactionRanges.partlySunny);
    setCloudyValue(satisfactionRanges.cloudy);
    setRainyValue(satisfactionRanges.rainy);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!title) {
      titleRef?.current?.focus();
      setTitleError("Please enter your class title");
      setLoading(false);
      return;
    }

    if (!semester?.season) {
      setSemesterError("Please select your class semester");
      setLoading(false);
      return;
    }

    try {
      const data = {
        title: title.trim().toLowerCase(),
        semester: `${semester?.season} ${semester?.year}`,
        satisfaction_ranges: JSON.stringify({
          sunny: sunnyValue,
          partlySunny: partlySunnyValue,
          cloudy: cloudyValue,
          rainy: rainyValue,
        }),
        grade: grade ? Number(grade) : null,
        accent_color: accentColor.toUpperCase(),
      };
      await addClass(data);
      Toast.show({
        ...baseSuccessToast,
        text2: "Your class has been added",
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setTimeout(() => {
        router.replace("/classes");
      }, 1500);
    } catch (error) {
      const message =
        error?.message === "Class already exists"
          ? "Class already exists"
          : "Failed to add class";
      Toast.show({ ...baseErrorToast, text2: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader
        title="Add Class"
        description="Enter your class information"
      />
      <View className="w-[80%] flex justify-center gap-8 mt-6">
        <Input
          label="Title"
          placeholder="Enter your class title"
          error={titleError}
          value={title}
          setValue={setTitle}
          setError={setTitleError}
          disabled={loading}
          inputRef={titleRef}
          inputMode={"text"}
          required
          maxLength={50}
        />
        <>
          <ButtonInput
            label={"Semester"}
            placeholder={
              semester?.season
                ? `${semester?.season} ${semester?.year}`
                : "Select your class semester"
            }
            required
            onPress={() => {
              if (loading) return;
              setIsSelectVisible(true);
            }}
            error={semesterError}
            setError={setSemesterError}
          />
          <SemesterModal
            semester={semester}
            setSemester={setSemester}
            semesterError={semesterError}
            setSemesterError={setSemesterError}
            isVisible={isSelectVisible}
            setIsVisible={setIsSelectVisible}
          />
        </>
        <>
          <ButtonInput
            label={"Satisfaction Ranges"}
            placeholder={formatSatisfactionRange({
              sunnyValue,
              partlySunnyValue,
              cloudyValue,
              rainyValue,
            })}
            onPress={() => {
              if (loading) return;
              setIsSatisfactionVisible(true);
            }}
          />
          <SatisfactionRangesModal
            sunnyValue={sunnyValue}
            setSunnyValue={setSunnyValue}
            partlySunnyValue={partlySunnyValue}
            setPartlySunnyValue={setPartlySunnyValue}
            cloudyValue={cloudyValue}
            setCloudyValue={setCloudyValue}
            rainyValue={rainyValue}
            setRainyValue={setRainyValue}
            isSatisfactionVisible={isSatisfactionVisible}
            setIsSatisfactionVisible={setIsSatisfactionVisible}
            loading={loading}
            resetSatisfactionRanges={resetSatisfactionRanges}
          />
        </>
        <GradeSelect
          grade={grade}
          setGrade={setGrade}
          getThemeColor={getThemeColor}
          disabled={loading}
        />
        <ColorPicker
          value={accentColor}
          setValue={setAccentColor}
          disabled={loading}
        />
        <Button
          text="Add Class"
          disabled={loading}
          marginTop="mt-0"
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
      <Toast config={toastConfig} />
    </View>
  );
}

import { View, Pressable, Text as RnText } from "react-native";
import {
  Input,
  PageModalHeader,
  ButtonInput,
  GradeSelect,
  Switch,
} from "@/components/common";
import {
  SemesterModal,
  ColorPicker,
  SatisfactionRangesModal,
} from "@/components/class";
import { useState } from "react";
import { useInputField } from "@/hooks";
import {
  formatSatisfactionRange,
  getRandomAccentColor,
  capitalize,
} from "@/utils";
import { satisfactionRanges } from "@/constants/satisfactionRanges";
import { addClass } from "@/queries/classes";
import Toast from "react-native-toast-message";
import {
  toastConfig,
  baseErrorToast,
  baseSuccessToast,
} from "@/constants/toastConfig";
import { useTheme } from "@/contexts";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function EditClass() {
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { getThemeColor } = useTheme();
  const [loading, setLoading] = useState(false);
  console.log(params);
  const {
    value: title,
    setValue: setTitle,
    error: titleError,
    setError: setTitleError,
    ref: titleRef,
  } = useInputField(capitalize(params?.title) || "");
  const {
    value: semester,
    setValue: setSemester,
    error: semesterError,
    setError: setSemesterError,
  } = useInputField(
    params?.semester
      ? {
          season: params?.semester?.split(" ")[0],
          year: Number(params?.semester?.split(" ")[1]),
        }
      : {
          season: "",
          year: new Date().getFullYear(),
        }
  );
  const { value: grade, setValue: setGrade } = useInputField(
    !isNaN(params?.grade) ? Number(params?.grade) : null
  );
  const { value: accentColor, setValue: setAccentColor } = useInputField(
    params?.accentColor?.toLowerCase() || getRandomAccentColor()
  );
  const [sunnyValue, setSunnyValue] = useState(satisfactionRanges.sunny);
  const [partlySunnyValue, setPartlySunnyValue] = useState(
    satisfactionRanges.partlySunny
  );
  const [cloudyValue, setCloudyValue] = useState(satisfactionRanges.cloudy);
  const [rainyValue, setRainyValue] = useState(satisfactionRanges.rainy);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [isSatisfactionVisible, setIsSatisfactionVisible] = useState(false);
  const [isClassCompleted, setIsClassCompleted] = useState(
    !!params?.isCompleted ? params?.isCompleted : false
  );

  const resetSatisfactionRanges = () => {
    setSunnyValue(satisfactionRanges.sunny);
    setPartlySunnyValue(satisfactionRanges.partlySunny);
    setCloudyValue(satisfactionRanges.cloudy);
    setRainyValue(satisfactionRanges.rainy);
  };

  const isClassChanged = false;

  const handleUpdate = async () => {};
  const handleDelete = async () => {};

  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader
        title="Your Class"
        description={"Edit or delete your class"}
        closeText="Close"
      />
      <View className="w-[80%] flex justify-center gap-8 mt-6">
        <Switch
          label={"Completed"}
          flip
          switchContainerClassName="-ml-1"
          containerClassName={"self-start -mb-2"}
          scale={0.75}
          showValue
          value={
            typeof isClassCompleted === "string"
              ? isClassCompleted === "true"
              : isClassCompleted
          }
          onValueChange={setIsClassCompleted}
          onText={"Yes"}
          offText={"No"}
        />
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
        <View className="flex justify-center gap-3 mt-0">
          <Pressable
            className={clsx(
              "flex-row items-center justify-center w-full py-4 rounded-md gap-0.5 -mt-1 bg-dark-bg dark:bg-light-bg",
              isClassChanged ? "opacity-100" : "opacity-50"
            )}
            onPress={handleUpdate}
          >
            <FontAwesome
              name="save"
              size={16}
              color={getThemeColor("#FFFFFF", "#000000")}
              style={{ marginRight: 4 }}
            />
            <RnText className="font-medium text-center text-white text-md dark:text-black">
              Save
            </RnText>
          </Pressable>

          <Pressable
            className="flex-row items-center justify-center w-full py-4 bg-red-500 rounded-md gap-0.5"
            onPress={handleDelete}
          >
            <FontAwesome
              name="trash"
              size={16}
              color={getThemeColor("#FFFFFF", "#000000")}
              style={{ marginRight: 4 }}
            />
            <RnText className="font-medium text-center text-white text-md dark:text-black">
              Delete
            </RnText>
          </Pressable>
        </View>
      </View>
      <Toast config={toastConfig} />
    </View>
  );
}

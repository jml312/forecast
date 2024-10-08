import { View } from "react-native";
import {
  Input,
  Button,
  InputDatePicker,
  PageModalHeader,
  ButtonInput,
  NumberInput,
} from "@/components/common";
import {
  SemesterModal,
  ColorPicker,
  SatisfactionRangesModal,
} from "@/components/class";
import { useState } from "react";
import { useInputField, useDateRange } from "@/hooks";
import { add, format } from "date-fns";
import { isValidInput, formatSatisfactionRange } from "@/utils";
import { satisfactionRanges } from "@/constants/satisfactionRanges";

export default function AddClassPage() {
  const [loading, setLoading] = useState(false);
  const [addClassError, setAddClassError] = useState(false);
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
    ref: semesterRef,
  } = useInputField();
  const { startDate, setStartDate, endDate, setEndDate } = useDateRange();
  const {
    value: grade,
    setValue: setGrade,
    error: gradeError,
    setError: setGradeError,
    ref: gradeRef,
  } = useInputField();
  const { value: accentColor, setValue: setAccentColor } = useInputField();
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

  const handleSubmit = () => {
    data = {
      title,
      grade,
    };

    console.log(data);
  };

  return (
    <View className="flex items-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <PageModalHeader
        title="Add A Class"
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
            placeholder={"Select your class semester"}
            required
            onPress={() => {
              if (loading) return;
              setIsSelectVisible(true);
            }}
          />
          <SemesterModal
            disabled={loading}
            label={"Semester"}
            placeholder={"Select your class semester"}
            value={semester}
            setValue={setSemester}
            items={[]}
            required
            isSelectVisible={isSelectVisible}
            setIsSelectVisible={setIsSelectVisible}
            loading={loading}
          />
        </>
        <View className="flex-row items-start justify-between w-full">
          <InputDatePicker
            date={startDate}
            setDate={setStartDate}
            mode="date"
            title="Start Date"
            width="47%"
            disabled={loading}
          />
          <InputDatePicker
            date={endDate}
            setDate={setEndDate}
            mode="date"
            title="End Date"
            width="47%"
            disabled={loading}
          />
        </View>
        <>
          <ButtonInput
            label={"Satisfaction Ranges"}
            placeholder={formatSatisfactionRange({
              sunnyValue,
              partlySunnyValue,
              cloudyValue,
              rainyValue,
            })}
            required
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
        <NumberInput
          label="Grade"
          placeholder="Enter your numeric grade"
          value={grade}
          setValue={setGrade}
          disabled={loading}
          minValue={0}
          maxValue={100}
        />
        <ColorPicker value={accentColor} setValue={setAccentColor} />

        <Button
          text="Add Class"
          disabled={loading}
          marginTop="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

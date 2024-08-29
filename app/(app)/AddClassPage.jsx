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
import { useInputField } from "@/hooks";
import { formatSatisfactionRange } from "@/utils";

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
  const {
    value: startDate,
    setValue: setStartDate,
    error: startDateError,
    setError: setStartDateError,
    ref: startDateRef,
  } = useInputField(new Date());
  const {
    value: endDate,
    setValue: setEndDate,
    error: endDateError,
    setError: setEndDateError,
    ref: endDateRef,
  } = useInputField(new Date());
  const {
    value: grade,
    setValue: setGrade,
    error: gradeError,
    setError: setGradeError,
    ref: gradeRef,
  } = useInputField();
  const { value: accentColor, setValue: setAccentColor } = useInputField();
  const [sunnyValue, setSunnyValue] = useState({
    min: 90,
    max: 100,
  });
  const [partlySunnyValue, setPartlySunnyValue] = useState({
    min: 80,
    max: 90,
  });
  const [cloudyValue, setCloudyValue] = useState({
    min: 70,
    max: 80,
  });
  const [rainyValue, setRainyValue] = useState({
    min: 0,
    max: 70,
  });
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [isSatisfactionVisible, setIsSatisfactionVisible] = useState(false);

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
          setValue={(value) => setTitle(value.trim().toLowerCase())}
          setError={setTitleError}
          disabled={loading}
          inputRef={titleRef}
          inputMode={"text"}
          required
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
          />
        </>
        <NumberInput
          // error={titleError}
          // value={title}
          // setValue={(value) => setTitle(value.trim().toLowerCase())}
          // setError={setTitleError}
          // disabled={loading}
          // inputRef={titleRef}
          // inputMode={"numeric"}
          label="Grade"
          placeholder="Enter your grade"
          // placeholder={`Min (${minValue} - ${maxValue})`}
          // width="45%"
          value={grade}
          setValue={setGrade}
          disabled={loading}
          minValue={0}
        />
        <ColorPicker value={accentColor} setValue={setAccentColor} />

        <Button text="Add Class" disabled={loading} marginTop="mt-0" />
      </View>
    </View>
  );
}

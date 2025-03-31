import { View } from "react-native";
import {
  Input,
  Button,
  InputDatePicker,
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
import { useInputField, useDateRange } from "@/hooks";
import { format } from "date-fns";
import { formatSatisfactionRange } from "@/utils";
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
  } = useInputField({
    season: "",
    startDate: null,
    endDate: null,
  });
  const [semesterOptions, setSemesterOptions] = useState([]);
  const { startDate, setStartDate, endDate, setEndDate } = useDateRange(false);
  const { value: grade, setValue: setGrade } = useInputField();
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

  const handleSubmit = async () => {
    // const data = {
    //   title,
    //   semester,
    //   startDate,
    //   endDate,
    //   ranges: {
    //     sunny: sunnyValue,
    //     partlySunny: partlySunnyValue,
    //     cloudy: cloudyValue,
    //     rainy: rainyValue,
    //   },
    //   grade,
    //   accentColor,
    // };

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

    setLoading(false);
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
            placeholder={
              semester?.season
                ? `${semester?.season} ${format(semester?.startDate, "yyyy")}`
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
            disabled={loading}
            label={"Semester"}
            placeholder={"Select your class semester"}
            value={semester}
            setValue={setSemester}
            items={semesterOptions}
            setItems={setSemesterOptions}
            required
            isSelectVisible={isSelectVisible}
            setIsSelectVisible={setIsSelectVisible}
            loading={loading}
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
        <GradeSelect grade={grade} setGrade={setGrade} />
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

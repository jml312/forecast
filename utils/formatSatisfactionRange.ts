import { weatherIcons } from "@/constants/weatherIcons";

export function formatSatisfactionRange({
  sunnyValue,
  partlySunnyValue,
  cloudyValue,
  rainyValue,
}) {
  const includePlus = sunnyValue?.low < 100;
  return `${sunnyValue?.low}${
    includePlus ? `+ ${weatherIcons.sunny}` : weatherIcons.sunny
  }, ${partlySunnyValue?.high} - ${partlySunnyValue?.low} ${
    weatherIcons.partlySunny
  }, ${cloudyValue?.high} - ${cloudyValue?.low} ${weatherIcons.cloudy}, ${
    rainyValue?.high
  } - ${rainyValue?.low} ${weatherIcons.rainy}`;
}

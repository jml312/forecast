import { satisfactionRanges } from "@/constants/satisfactionRanges";

export function getWeatherIcon(grade) {
  let weather = "sunny";

  if (!grade) return weather;

  // sunny
  if (
    grade >= satisfactionRanges.sunny.low &&
    grade <= satisfactionRanges.sunny.high
  ) {
    weather = "sunny";
  }
  // partly sunny
  else if (
    grade >= satisfactionRanges.partlySunny.low &&
    grade <= satisfactionRanges.partlySunny.high
  ) {
    weather = "partly-sunny";
  }
  // cloudy
  else if (
    grade >= satisfactionRanges.cloudy.low &&
    grade <= satisfactionRanges.cloudy.high
  ) {
    weather = "cloudy";
  }
  // rainy
  else if (
    grade >= satisfactionRanges.rainy.low &&
    grade <= satisfactionRanges.rainy.high
  ) {
    weather = "rainy";
  }
  return weather;
}

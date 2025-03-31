export function formatSatisfactionRange({
  sunnyValue,
  partlySunnyValue,
  cloudyValue,
  rainyValue,
}) {
  const includePlus = sunnyValue?.low < 100;
  return `${sunnyValue?.low}${includePlus ? "+ 🌤️" : "🌤️"}, ${
    partlySunnyValue?.high
  } - ${partlySunnyValue?.low} ⛅, ${cloudyValue?.high} - ${
    cloudyValue?.low
  } ☁️, ${rainyValue?.high} - ${rainyValue?.low} 🌧️`;
}

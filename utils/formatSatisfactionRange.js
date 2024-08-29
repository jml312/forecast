export function formatSatisfactionRange({
  sunnyValue,
  partlySunnyValue,
  cloudyValue,
  rainyValue,
}) {
  const includePlus = sunnyValue?.lower?.value < 100;
  return `${sunnyValue?.lower?.value}${includePlus ? "+ 🌤️" : "🌤️"}, ${
    partlySunnyValue?.lower?.value
  } - ${partlySunnyValue?.higher?.value} ⛅, ${cloudyValue?.lower?.value} - ${
    cloudyValue?.higher?.value
  } ☁️, ${rainyValue?.lower?.value} - ${rainyValue?.higher?.value} 🌧️`;
}

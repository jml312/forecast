import capitalizeTitle from "capitalize-title";

export function capitalize(str) {
  if (typeof str !== "string") return str;
  return capitalizeTitle(str);
}

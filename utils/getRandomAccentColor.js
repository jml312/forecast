import { accentColors } from "@/constants/accentColors";
export function getRandomAccentColor() {
  const randomIndex = Math.floor(Math.random() * accentColors.length);
  return accentColors[randomIndex];
}

import { View } from "react-native";
import { brandDark, brandLight } from "@jff/ui/brand";
import { useTheme } from "@/lib/theme/ThemeProvider";

/** Subtle brand backdrop for screens */
export default function BrandAtmosphere() {
  const { resolved } = useTheme();
  const tokens = resolved === "dark" ? brandDark : brandLight;

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 -z-10"
      style={{ backgroundColor: tokens.background }}
    />
  );
}

import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Svg, { Text as SvgText } from "react-native-svg";
import { brandDark, brandLight } from "@jff/ui/brand";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface BrandLogoProps {
  width?: number;
  height?: number;
  variant?: "light" | "dark";
}

function LogoSvg({
  fill,
  width,
  height,
}: {
  fill: string;
  width: number;
  height: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 60">
      <SvgText
        x="10"
        y="45"
        fill={fill}
        fontSize="42"
        fontWeight="800"
        letterSpacing="6"
      >
        JFF
      </SvgText>
    </Svg>
  );
}

export default function BrandLogo({
  width = 80,
  height = 30,
  variant,
}: BrandLogoProps) {
  const { resolved } = useTheme();
  const mode = variant ?? resolved;
  const fill = mode === "dark" ? brandDark.logo : brandLight.logo;

  return (
    <View style={{ width, height }}>
      <Animated.View
        key={mode}
        entering={FadeIn.duration(350)}
        exiting={FadeOut.duration(250)}
      >
        <LogoSvg fill={fill} width={width} height={height} />
      </Animated.View>
    </View>
  );
}

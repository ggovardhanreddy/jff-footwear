import type { ReactNode } from "react";
import { View } from "react-native";
import BrandAtmosphere from "@/components/brand/BrandAtmosphere";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
}

/** Branded screen wrapper with theme-aware background */
export default function ScreenShell({ children, className = "flex-1" }: ScreenShellProps) {
  return (
    <View className={className}>
      <BrandAtmosphere />
      {children}
    </View>
  );
}

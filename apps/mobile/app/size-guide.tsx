import { Text } from "react-native";
import { SIZE_GUIDE_DATA } from "@jff/shared/pages";
import BusinessScreen from "@/components/BusinessScreen";

function SizeTable({
  label,
  sizes,
}: {
  label: string;
  sizes: readonly { size: string; footCm: string }[];
}) {
  return (
    <>
      <Text className="mb-2 mt-4 text-lg font-semibold text-brand-black dark:text-white">
        {label}
      </Text>
      {sizes.map((row) => (
        <Text key={`${label}-${row.size}`} className="mb-1 text-sm text-brand-muted dark:text-zinc-400">
          Size {row.size} — {row.footCm} cm
        </Text>
      ))}
    </>
  );
}

export default function SizeGuideScreen() {
  return (
    <BusinessScreen title="Size Guide">
      <Text className="mb-4 text-base font-semibold text-brand-black dark:text-white">
        How to Measure
      </Text>
      {SIZE_GUIDE_DATA.measureSteps.map((step, index) => (
        <Text key={step} className="mb-2 text-sm leading-6 text-brand-muted dark:text-zinc-400">
          {index + 1}. {step}
        </Text>
      ))}
      <SizeTable label={SIZE_GUIDE_DATA.men.label} sizes={SIZE_GUIDE_DATA.men.sizes} />
      <SizeTable label={SIZE_GUIDE_DATA.women.label} sizes={SIZE_GUIDE_DATA.women.sizes} />
      <SizeTable label={SIZE_GUIDE_DATA.kids.label} sizes={SIZE_GUIDE_DATA.kids.sizes} />
    </BusinessScreen>
  );
}

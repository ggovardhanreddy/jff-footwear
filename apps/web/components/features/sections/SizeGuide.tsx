import SizeGuide from "@/components/site/SizeGuide";

export default function SizeGuideSection({
  className,
}: {
  className?: string;
}) {
  return <SizeGuide className={className} compact />;
}

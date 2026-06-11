import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandReason = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
    <Path d="M18 18h-3v-6h3" />
    <Path d="M18 15h-3" />
    <Path d="M8 18v-6h2.5a1.5 1.5 0 0 1 0 3h-2.5" />
    <Path d="M12 18l-2 -3" />
  </Svg>
);
export default SvgBrandReason;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextPlus = (props: SvgProps) => (
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
    <Path d="M19 10h-14" />
    <Path d="M5 6h14" />
    <Path d="M14 14h-9" />
    <Path d="M5 18h6" />
    <Path d="M18 15v6" />
    <Path d="M15 18h6" />
  </Svg>
);
export default SvgTextPlus;

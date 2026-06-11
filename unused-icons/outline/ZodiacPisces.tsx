import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacPisces = (props: SvgProps) => (
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
    <Path d="M5 3a21 21 0 0 1 0 18" />
    <Path d="M19 3a21 21 0 0 0 0 18" />
    <Path d="M5 12l14 0" />
  </Svg>
);
export default SvgZodiacPisces;

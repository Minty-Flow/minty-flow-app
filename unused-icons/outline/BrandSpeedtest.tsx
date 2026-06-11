import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandSpeedtest = (props: SvgProps) => (
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
    <Path d="M5.636 19.364a9 9 0 1 1 12.728 0" />
    <Path d="M16 9l-4 4" />
  </Svg>
);
export default SvgBrandSpeedtest;

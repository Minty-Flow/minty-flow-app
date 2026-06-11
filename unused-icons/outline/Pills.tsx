import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPills = (props: SvgProps) => (
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
    <Path d="M3 8a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M13 17a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M4.5 4.5l7 7" />
    <Path d="M19.5 14.5l-5 5" />
  </Svg>
);
export default SvgPills;

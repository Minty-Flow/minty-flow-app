import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRecordMailOff = (props: SvgProps) => (
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
    <Path d="M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M18.569 14.557a3 3 0 1 0 -4.113 -4.149" />
    <Path d="M7 15h8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRecordMailOff;

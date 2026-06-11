import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderBigender = (props: SvgProps) => (
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
    <Path d="M7 11a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M19 3l-5 5" />
    <Path d="M15 3h4v4" />
    <Path d="M11 16v6" />
    <Path d="M8 19h6" />
  </Svg>
);
export default SvgGenderBigender;

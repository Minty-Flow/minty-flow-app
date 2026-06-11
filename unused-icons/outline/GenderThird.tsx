import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderThird = (props: SvgProps) => (
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
    <Path d="M11 12a5 5 0 1 0 10 0a5 5 0 0 0 -10 0" />
    <Path d="M11 12h-3" />
    <Path d="M8 12l-5 -4v8l5 -4" />
  </Svg>
);
export default SvgGenderThird;

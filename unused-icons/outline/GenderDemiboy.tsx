import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderDemiboy = (props: SvgProps) => (
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
    <Path d="M5 14a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M19 5l-5.4 5.4" />
    <Path d="M19 5h-5" />
  </Svg>
);
export default SvgGenderDemiboy;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWheelchairOff = (props: SvgProps) => (
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
    <Path d="M3 16a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M17.582 17.59a2 2 0 0 0 2.833 2.824" />
    <Path d="M14 14h-1.4" />
    <Path d="M6 6v5" />
    <Path d="M6 8h2m4 0h5" />
    <Path d="M15 8v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWheelchairOff;

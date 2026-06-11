import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodSmileDizzy = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
    <Path d="M8 9l2 2" />
    <Path d="M10 9l-2 2" />
    <Path d="M14 9l2 2" />
    <Path d="M16 9l-2 2" />
  </Svg>
);
export default SvgMoodSmileDizzy;

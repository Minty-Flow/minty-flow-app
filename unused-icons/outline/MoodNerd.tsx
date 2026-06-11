import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodNerd = (props: SvgProps) => (
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
    <Path d="M6 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M14 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
    <Path d="M3.5 9h2.5" />
    <Path d="M18 9h2.5" />
    <Path d="M10 9.5c1.333 -1.333 2.667 -1.333 4 0" />
  </Svg>
);
export default SvgMoodNerd;

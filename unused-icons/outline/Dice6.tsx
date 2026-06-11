import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDice6 = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
    <Path d="M8 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M15 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M8 12a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M15 12a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M15 16.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M8 16.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
  </Svg>
);
export default SvgDice6;

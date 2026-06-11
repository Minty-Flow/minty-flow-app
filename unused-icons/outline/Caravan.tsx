import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCaravan = (props: SvgProps) => (
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
    <Path d="M7 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M11 18h7a2 2 0 0 0 2 -2v-7a2 2 0 0 0 -2 -2h-9.5a5.5 5.5 0 0 0 -5.5 5.5v3.5a2 2 0 0 0 2 2h2" />
    <Path d="M8 7l7 -3l1 3" />
    <Path d="M13 11.5a.5 .5 0 0 1 .5 -.5h2a.5 .5 0 0 1 .5 .5v2a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5l0 -2" />
    <Path d="M20 16h2" />
  </Svg>
);
export default SvgCaravan;

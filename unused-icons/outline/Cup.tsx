import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCup = (props: SvgProps) => (
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
    <Path d="M5 11h14v-3h-14l0 3" />
    <Path d="M17.5 11l-1.5 10h-8l-1.5 -10" />
    <Path d="M6 8v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1" />
    <Path d="M15 5v-2" />
  </Svg>
);
export default SvgCup;

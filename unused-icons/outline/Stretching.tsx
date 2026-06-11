import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStretching = (props: SvgProps) => (
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
    <Path d="M15 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M5 20l5 -.5l1 -2" />
    <Path d="M18 20v-5h-5.5l2.5 -6.5l-5.5 1l1.5 2" />
  </Svg>
);
export default SvgStretching;

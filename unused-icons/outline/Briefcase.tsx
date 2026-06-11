import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBriefcase = (props: SvgProps) => (
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
    <Path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
    <Path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
    <Path d="M12 12l0 .01" />
    <Path d="M3 13a20 20 0 0 0 18 0" />
  </Svg>
);
export default SvgBriefcase;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScubaDivingTank = (props: SvgProps) => (
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
    <Path d="M8 11a4 4 0 1 1 8 0v5h-8l0 -5" />
    <Path d="M8 16v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-3" />
    <Path d="M9 4h6" />
    <Path d="M12 7v-3" />
    <Path d="M7 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11.5 4a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
  </Svg>
);
export default SvgScubaDivingTank;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTestPipeOff = (props: SvgProps) => (
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
    <Path d="M20 8.04a803.533 803.533 0 0 0 -4 3.96m-2 2c-1.085 1.085 -3.125 3.14 -6.122 6.164a2.857 2.857 0 0 1 -4.041 -4.04c3.018 -3 5.073 -5.037 6.163 -6.124m2 -2c.872 -.872 2.191 -2.205 3.959 -4" />
    <Path d="M7 13h6" />
    <Path d="M19 15l1.5 1.6m-.74 3.173a2 2 0 0 1 -2.612 -2.608" />
    <Path d="M15 3l6 6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTestPipeOff;

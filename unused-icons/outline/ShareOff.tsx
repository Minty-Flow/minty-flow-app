import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShareOff = (props: SvgProps) => (
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
    <Path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15.861 15.896a3 3 0 0 0 4.265 4.22m.578 -3.417a3.012 3.012 0 0 0 -1.507 -1.45" />
    <Path d="M8.7 10.7l1.336 -.688m2.624 -1.352l2.64 -1.36" />
    <Path d="M8.7 13.3l6.6 3.4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgShareOff;

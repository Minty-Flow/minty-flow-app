import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStorm = (props: SvgProps) => (
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
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M5.369 14.236c-1.839 -3.929 -1.561 -7.616 -.704 -11.236" />
    <Path d="M18.63 9.76c1.837 3.928 1.561 7.615 .703 11.236" />
  </Svg>
);
export default SvgStorm;

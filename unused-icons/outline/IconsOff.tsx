import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIconsOff = (props: SvgProps) => (
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
    <Path d="M4.01 4.041a3.5 3.5 0 0 0 2.49 5.959c.975 0 1.865 -.357 2.5 -1m.958 -3.044a3.503 3.503 0 0 0 -2.905 -2.912" />
    <Path d="M2.5 21h8l-4 -7l-4 7" />
    <Path d="M14 3l7 7" />
    <Path d="M14 10l7 -7" />
    <Path d="M18 14h3v3m0 4h-7v-7" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgIconsOff;

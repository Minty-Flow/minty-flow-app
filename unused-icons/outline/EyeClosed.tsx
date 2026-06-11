import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeClosed = (props: SvgProps) => (
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
    <Path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
    <Path d="M3 15l2.5 -3.8" />
    <Path d="M21 14.976l-2.492 -3.776" />
    <Path d="M9 17l.5 -4" />
    <Path d="M15 17l-.5 -4" />
  </Svg>
);
export default SvgEyeClosed;

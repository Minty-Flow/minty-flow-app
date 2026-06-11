import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleOpenArrowDown = (props: SvgProps) => (
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
    <Path d="M15.998 3.934a9 9 0 1 1 -3.998 -.934v13" />
    <Path d="M16 12l-4 4l-4 -4" />
  </Svg>
);
export default SvgCircleOpenArrowDown;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTiltShiftOff = (props: SvgProps) => (
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
    <Path d="M8.56 3.69a9 9 0 0 0 -.577 .263" />
    <Path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
    <Path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
    <Path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
    <Path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
    <Path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
    <Path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
    <Path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
    <Path d="M10.57 10.602a2 2 0 0 0 2.862 2.795" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTiltShiftOff;

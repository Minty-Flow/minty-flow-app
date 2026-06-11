import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRotate3D = (props: SvgProps) => (
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
    <Path d="M12 3a7 7 0 0 1 7 7v4l-3 -3" />
    <Path d="M22 11l-3 3" />
    <Path d="M8 15.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
    <Path d="M3 12.5v5.5l5 3" />
    <Path d="M8 15.545l5 -3.03" />
  </Svg>
);
export default SvgRotate3D;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingLighthouse = (props: SvgProps) => (
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
    <Path d="M12 3l2 3l2 15h-8l2 -15l2 -3" />
    <Path d="M8 9l8 0" />
    <Path d="M3 11l2 -2l-2 -2" />
    <Path d="M21 11l-2 -2l2 -2" />
  </Svg>
);
export default SvgBuildingLighthouse;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSteeringWheelOff = (props: SvgProps) => (
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
    <Path d="M20.04 16.048a9 9 0 0 0 -12.083 -12.09m-2.32 1.678a9 9 0 1 0 12.737 12.719" />
    <Path d="M10.595 10.576a2 2 0 1 0 2.827 2.83" />
    <Path d="M12 14v7" />
    <Path d="M10 12l-6.75 -2" />
    <Path d="M15.542 11.543l5.208 -1.543" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSteeringWheelOff;

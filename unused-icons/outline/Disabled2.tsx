import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDisabled2 = (props: SvgProps) => (
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
    <Path d="M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M9 11a5 5 0 1 0 3.95 7.95" />
    <Path d="M19 20l-4 -5h-4l3 -5l-4 -3l-4 1" />
  </Svg>
);
export default SvgDisabled2;

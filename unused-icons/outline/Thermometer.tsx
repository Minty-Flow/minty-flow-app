import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgThermometer = (props: SvgProps) => (
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
    <Path d="M19 5a2.828 2.828 0 0 1 0 4l-8 8h-4v-4l8 -8a2.828 2.828 0 0 1 4 0" />
    <Path d="M16 7l-1.5 -1.5" />
    <Path d="M13 10l-1.5 -1.5" />
    <Path d="M10 13l-1.5 -1.5" />
    <Path d="M7 17l-3 3" />
  </Svg>
);
export default SvgThermometer;

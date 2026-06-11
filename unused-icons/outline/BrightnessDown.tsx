import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrightnessDown = (props: SvgProps) => (
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
    <Path d="M12 5l0 .01" />
    <Path d="M17 7l0 .01" />
    <Path d="M19 12l0 .01" />
    <Path d="M17 17l0 .01" />
    <Path d="M12 19l0 .01" />
    <Path d="M7 17l0 .01" />
    <Path d="M5 12l0 .01" />
    <Path d="M7 7l0 .01" />
  </Svg>
);
export default SvgBrightnessDown;

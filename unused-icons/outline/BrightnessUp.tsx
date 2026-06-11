import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrightnessUp = (props: SvgProps) => (
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
    <Path d="M12 5l0 -2" />
    <Path d="M17 7l1.4 -1.4" />
    <Path d="M19 12l2 0" />
    <Path d="M17 17l1.4 1.4" />
    <Path d="M12 19l0 2" />
    <Path d="M7 17l-1.4 1.4" />
    <Path d="M6 12l-2 0" />
    <Path d="M7 7l-1.4 -1.4" />
  </Svg>
);
export default SvgBrightnessUp;

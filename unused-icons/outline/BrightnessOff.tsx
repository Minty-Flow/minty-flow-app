import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrightnessOff = (props: SvgProps) => (
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
    <Path d="M12 3v5m0 4v9" />
    <Path d="M5.641 5.631a9 9 0 1 0 12.719 12.738m1.68 -2.318a9 9 0 0 0 -12.074 -12.098" />
    <Path d="M12.5 8.5l4.15 -4.15" />
    <Path d="M12 14l1.025 -.983m2.065 -1.981l4.28 -4.106" />
    <Path d="M12 19.6l3.79 -3.79m2 -2l3.054 -3.054" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBrightnessOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrightness = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M12 3l0 18" />
    <Path d="M12 9l4.65 -4.65" />
    <Path d="M12 14.3l7.37 -7.37" />
    <Path d="M12 19.6l8.85 -8.85" />
  </Svg>
);
export default SvgBrightness;

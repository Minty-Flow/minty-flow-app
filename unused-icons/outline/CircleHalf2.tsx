import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleHalf2 = (props: SvgProps) => (
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
    <Path d="M12 3v18" />
    <Path d="M12 14l7 -7" />
    <Path d="M12 19l8.5 -8.5" />
    <Path d="M12 9l4.5 -4.5" />
  </Svg>
);
export default SvgCircleHalf2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDirections = (props: SvgProps) => (
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
    <Path d="M12 21v-4" />
    <Path d="M12 13v-4" />
    <Path d="M12 5v-2" />
    <Path d="M10 21h4" />
    <Path d="M8 5v4h11l2 -2l-2 -2l-11 0" />
    <Path d="M14 13v4h-8l-2 -2l2 -2l8 0" />
  </Svg>
);
export default SvgDirections;

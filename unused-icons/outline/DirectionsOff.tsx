import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDirectionsOff = (props: SvgProps) => (
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
    <Path d="M12 13v-1" />
    <Path d="M12 5v-2" />
    <Path d="M10 21h4" />
    <Path d="M8 8v1h1m4 0h6l2 -2l-2 -2h-10" />
    <Path d="M14 14v3h-8l-2 -2l2 -2h7" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDirectionsOff;

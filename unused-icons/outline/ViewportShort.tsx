import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgViewportShort = (props: SvgProps) => (
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
    <Path d="M12 3v7l3 -3" />
    <Path d="M9 7l3 3" />
    <Path d="M12 21v-7l3 3" />
    <Path d="M9 17l3 -3" />
    <Path d="M18 9h1a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-1" />
    <Path d="M6 9h-1a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h1" />
  </Svg>
);
export default SvgViewportShort;

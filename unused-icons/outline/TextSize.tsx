import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextSize = (props: SvgProps) => (
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
    <Path d="M3 7v-2h13v2" />
    <Path d="M10 5v14" />
    <Path d="M12 19h-4" />
    <Path d="M15 13v-1h6v1" />
    <Path d="M18 12v7" />
    <Path d="M17 19h2" />
  </Svg>
);
export default SvgTextSize;

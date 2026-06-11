import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTargetArrow = (props: SvgProps) => (
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
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M12 7a5 5 0 1 0 5 5" />
    <Path d="M13 3.055a9 9 0 1 0 7.941 7.945" />
    <Path d="M15 6v3h3l3 -3h-3v-3l-3 3" />
    <Path d="M15 9l-3 3" />
  </Svg>
);
export default SvgTargetArrow;

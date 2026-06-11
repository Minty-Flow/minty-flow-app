import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapPinShare = (props: SvgProps) => (
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
    <Path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M12.02 21.485a1.996 1.996 0 0 1 -1.433 -.585l-4.244 -4.243a8 8 0 1 1 13.403 -3.651" />
    <Path d="M16 22l5 -5" />
    <Path d="M21 21.5v-4.5h-4.5" />
  </Svg>
);
export default SvgMapPinShare;

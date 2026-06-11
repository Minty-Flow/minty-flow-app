import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeLock = (props: SvgProps) => (
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
    <Path d="M5 12h-2l9 -9l8 8" />
    <Path d="M5 12v7a2 2 0 0 0 2 2h6" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2c.688 0 1.294 .347 1.654 .875" />
    <Path d="M17 19a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-2" />
    <Path d="M18 18v-1.5a1.5 1.5 0 1 1 3 0v1.5" />
  </Svg>
);
export default SvgHomeLock;

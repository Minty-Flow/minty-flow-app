import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScreenShare = (props: SvgProps) => (
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
    <Path d="M21 12v3a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h9" />
    <Path d="M7 20l10 0" />
    <Path d="M9 16l0 4" />
    <Path d="M15 16l0 4" />
    <Path d="M17 4h4v4" />
    <Path d="M16 9l5 -5" />
  </Svg>
);
export default SvgScreenShare;

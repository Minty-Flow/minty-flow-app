import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCubeSend = (props: SvgProps) => (
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
    <Path d="M16 12.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" />
    <Path d="M11 9.5v5.5l5 3" />
    <Path d="M16 12.545l5 -3.03" />
    <Path d="M7 9h-5" />
    <Path d="M7 12h-3" />
    <Path d="M7 15h-1" />
  </Svg>
);
export default SvgCubeSend;

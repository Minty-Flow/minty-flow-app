import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBotId = (props: SvgProps) => (
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
    <Path d="M7 10.5c0 -.828 .746 -1.5 1.667 -1.5h6.666c.92 0 1.667 .672 1.667 1.5v3c0 .828 -.746 1.5 -1.667 1.5h-6.666c-.92 0 -1.667 -.672 -1.667 -1.5v-3" />
    <Path d="M12 7v2" />
    <Path d="M10 12v.01" />
    <Path d="M14 12v.01" />
    <Path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <Path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
  </Svg>
);
export default SvgBotId;

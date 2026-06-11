import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFrameOff = (props: SvgProps) => (
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
    <Path d="M4 7h3m4 0h9" />
    <Path d="M4 17h13" />
    <Path d="M7 7v13" />
    <Path d="M17 4v9m0 4v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFrameOff;

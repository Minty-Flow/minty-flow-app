import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScreenshot = (props: SvgProps) => (
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
    <Path d="M7 19a2 2 0 0 1 -2 -2" />
    <Path d="M5 13v-2" />
    <Path d="M5 7a2 2 0 0 1 2 -2" />
    <Path d="M11 5h2" />
    <Path d="M17 5a2 2 0 0 1 2 2" />
    <Path d="M19 11v2" />
    <Path d="M19 17v4" />
    <Path d="M21 19h-4" />
    <Path d="M13 19h-2" />
  </Svg>
);
export default SvgScreenshot;

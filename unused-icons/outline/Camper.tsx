import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCamper = (props: SvgProps) => (
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
    <Path d="M5 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M15 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M5 18h-1a1 1 0 0 1 -1 -1v-11a2 2 0 0 1 2 -2h12a4 4 0 0 1 4 4h-18" />
    <Path d="M9 18h6" />
    <Path d="M19 18h1a1 1 0 0 0 1 -1v-4l-3 -5" />
    <Path d="M21 13h-7" />
    <Path d="M14 8v10" />
  </Svg>
);
export default SvgCamper;

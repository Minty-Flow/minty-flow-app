import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCameraAi = (props: SvgProps) => (
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
    <Path d="M10 20h-5a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v2" />
    <Path d="M14.362 11.15a3 3 0 1 0 -4.144 4.263" />
    <Path d="M14 21v-4a2 2 0 1 1 4 0v4" />
    <Path d="M14 19h4" />
    <Path d="M21 15v6" />
  </Svg>
);
export default SvgCameraAi;

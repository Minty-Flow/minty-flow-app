import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapBolt = (props: SvgProps) => (
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
    <Path d="M13 19l-4 -2l-6 3v-13l6 -3l6 3l6 -3v8.5" />
    <Path d="M9 4v13" />
    <Path d="M15 7v7.5" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgMapBolt;

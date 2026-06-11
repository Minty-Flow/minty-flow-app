import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandUnity = (props: SvgProps) => (
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
    <Path d="M14 3l6 4v7" />
    <Path d="M18 17l-6 4l-6 -4" />
    <Path d="M4 14v-7l6 -4" />
    <Path d="M4 7l8 5v9" />
    <Path d="M20 7l-8 5" />
  </Svg>
);
export default SvgBrandUnity;

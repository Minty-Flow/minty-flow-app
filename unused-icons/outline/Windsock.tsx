import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindsock = (props: SvgProps) => (
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
    <Path d="M6 3v18" />
    <Path d="M6 11l12 -1v-4l-12 -1" />
    <Path d="M10 5.5v5" />
    <Path d="M14 6v4" />
    <Path d="M4 21h4" />
  </Svg>
);
export default SvgWindsock;

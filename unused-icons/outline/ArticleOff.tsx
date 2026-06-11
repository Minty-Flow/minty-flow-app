import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArticleOff = (props: SvgProps) => (
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
    <Path d="M8 4h11a2 2 0 0 1 2 2v11m-1.172 2.821a1.993 1.993 0 0 1 -.828 .179h-14a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 1.156 -1.814" />
    <Path d="M7 8h1m4 0h5" />
    <Path d="M7 12h5m4 0h1" />
    <Path d="M7 16h9" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgArticleOff;

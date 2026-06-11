import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRss = (props: SvgProps) => (
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
    <Path d="M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M4 4a16 16 0 0 1 16 16" />
    <Path d="M4 11a9 9 0 0 1 9 9" />
  </Svg>
);
export default SvgRss;

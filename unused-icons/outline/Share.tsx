import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShare = (props: SvgProps) => (
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
    <Path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M8.7 10.7l6.6 -3.4" />
    <Path d="M8.7 13.3l6.6 3.4" />
  </Svg>
);
export default SvgShare;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScissors = (props: SvgProps) => (
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
    <Path d="M3 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M8.6 8.6l10.4 10.4" />
    <Path d="M8.6 15.4l10.4 -10.4" />
  </Svg>
);
export default SvgScissors;

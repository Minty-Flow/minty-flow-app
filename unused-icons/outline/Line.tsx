import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLine = (props: SvgProps) => (
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
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7.5 16.5l9 -9" />
  </Svg>
);
export default SvgLine;

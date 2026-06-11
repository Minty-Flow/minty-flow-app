import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPrison = (props: SvgProps) => (
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
    <Path d="M18 4v16" />
    <Path d="M14 4v16" />
    <Path d="M6 4v5" />
    <Path d="M6 15v5" />
    <Path d="M10 4v5" />
    <Path d="M11 9h-6v6h6l0 -6" />
    <Path d="M10 15v5" />
    <Path d="M8 12h-.01" />
  </Svg>
);
export default SvgPrison;

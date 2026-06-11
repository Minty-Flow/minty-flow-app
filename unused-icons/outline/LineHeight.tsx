import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLineHeight = (props: SvgProps) => (
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
    <Path d="M3 8l3 -3l3 3" />
    <Path d="M3 16l3 3l3 -3" />
    <Path d="M6 5l0 14" />
    <Path d="M13 6l7 0" />
    <Path d="M13 12l7 0" />
    <Path d="M13 18l7 0" />
  </Svg>
);
export default SvgLineHeight;

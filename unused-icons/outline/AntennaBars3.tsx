import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAntennaBars3 = (props: SvgProps) => (
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
    <Path d="M6 18l0 -3" />
    <Path d="M10 18l0 -6" />
    <Path d="M14 18l0 .01" />
    <Path d="M18 18l0 .01" />
  </Svg>
);
export default SvgAntennaBars3;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLeftRhombus = (props: SvgProps) => (
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
    <Path d="M16 12h-13" />
    <Path d="M6 9l-3 3l3 3" />
    <Path d="M18.5 9.5l2.5 2.5l-2.5 2.5l-2.5 -2.5l2.5 -2.5" />
  </Svg>
);
export default SvgArrowLeftRhombus;

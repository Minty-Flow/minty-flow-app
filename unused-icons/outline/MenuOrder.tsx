import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMenuOrder = (props: SvgProps) => (
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
    <Path d="M4 10h16" />
    <Path d="M4 14h16" />
    <Path d="M9 18l3 3l3 -3" />
    <Path d="M9 6l3 -3l3 3" />
  </Svg>
);
export default SvgMenuOrder;

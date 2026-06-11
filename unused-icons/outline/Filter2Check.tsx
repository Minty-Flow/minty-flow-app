import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilter2Check = (props: SvgProps) => (
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
    <Path d="M4 6h16" />
    <Path d="M6 12h12" />
    <Path d="M9 18h2" />
    <Path d="M15 18l2 2l4 -4" />
  </Svg>
);
export default SvgFilter2Check;

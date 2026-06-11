import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMenu3 = (props: SvgProps) => (
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
    <Path d="M10 6h10" />
    <Path d="M4 12h16" />
    <Path d="M7 12h13" />
    <Path d="M4 18h10" />
  </Svg>
);
export default SvgMenu3;

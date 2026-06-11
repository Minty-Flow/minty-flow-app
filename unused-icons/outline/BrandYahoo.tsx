import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandYahoo = (props: SvgProps) => (
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
    <Path d="M3 6l5 0" />
    <Path d="M7 18l7 0" />
    <Path d="M4.5 6l5.5 7v5" />
    <Path d="M10 13l6 -5" />
    <Path d="M12.5 8l5 0" />
    <Path d="M20 11l0 4" />
    <Path d="M20 18l0 .01" />
  </Svg>
);
export default SvgBrandYahoo;

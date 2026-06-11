import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShadowOff = (props: SvgProps) => (
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
    <Path d="M5.634 5.638a9 9 0 0 0 12.728 12.727m1.68 -2.32a9 9 0 0 0 -12.086 -12.088" />
    <Path d="M16 12h2" />
    <Path d="M13 15h2" />
    <Path d="M13 18h1" />
    <Path d="M13 9h4" />
    <Path d="M13 6h1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgShadowOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPassword = (props: SvgProps) => (
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
    <Path d="M12 10v4" />
    <Path d="M10 13l4 -2" />
    <Path d="M10 11l4 2" />
    <Path d="M5 10v4" />
    <Path d="M3 13l4 -2" />
    <Path d="M3 11l4 2" />
    <Path d="M19 10v4" />
    <Path d="M17 13l4 -2" />
    <Path d="M17 11l4 2" />
  </Svg>
);
export default SvgPassword;

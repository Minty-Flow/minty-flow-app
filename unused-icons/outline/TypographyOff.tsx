import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTypographyOff = (props: SvgProps) => (
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
    <Path d="M4 20h3" />
    <Path d="M14 20h6" />
    <Path d="M6.9 15h6.9" />
    <Path d="M13 13l3 7" />
    <Path d="M5 20l4.09 -10.906" />
    <Path d="M10.181 6.183l.819 -2.183h2l3.904 8.924" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTypographyOff;

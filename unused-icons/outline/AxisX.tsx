import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAxisX = (props: SvgProps) => (
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
    <Path d="M4 13v.01" />
    <Path d="M4 9v.01" />
    <Path d="M4 5v.01" />
    <Path d="M17 20l3 -3l-3 -3" />
    <Path d="M4 17h16" />
  </Svg>
);
export default SvgAxisX;

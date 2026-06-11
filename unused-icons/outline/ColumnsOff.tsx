import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumnsOff = (props: SvgProps) => (
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
    <Path d="M4 6h2" />
    <Path d="M4 10h5.5" />
    <Path d="M4 14h5.5" />
    <Path d="M4 18h5.5" />
    <Path d="M14.5 6h5.5" />
    <Path d="M14.5 10h5.5" />
    <Path d="M18 14h2" />
    <Path d="M14.5 18h3.5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgColumnsOff;

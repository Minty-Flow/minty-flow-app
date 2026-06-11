import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWind = (props: SvgProps) => (
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
    <Path d="M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.24" />
    <Path d="M3 12h15.5a2.5 2.5 0 1 1 -2.34 3.24" />
    <Path d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24" />
  </Svg>
);
export default SvgWind;

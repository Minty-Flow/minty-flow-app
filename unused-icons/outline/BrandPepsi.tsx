import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPepsi = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M4 16c5.713 -2.973 11 -3.5 13.449 -11.162" />
    <Path d="M5 17.5c5.118 -2.859 15 0 14 -11" />
  </Svg>
);
export default SvgBrandPepsi;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlphabetArabic = (props: SvgProps) => (
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
    <Path d="M10 6v4" />
    <Path d="M13 14h8q -2.518 -3 -4 -3" />
    <Path d="M13 6v9.958c0 .963 0 1.444 -.293 1.743s-.764 .299 -1.707 .299h-1" />
    <Path d="M7 6v9.958c0 .963 0 1.444 -.293 1.743s-.764 .299 -1.707 .299h-1" />
  </Svg>
);
export default SvgAlphabetArabic;

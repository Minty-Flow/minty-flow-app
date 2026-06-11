import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDribbble = (props: SvgProps) => (
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
    <Path d="M9 3.6c5 6 7 10.5 7.5 16.2" />
    <Path d="M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4" />
    <Path d="M3.1 10.75c5 0 9.814 -.38 15.314 -5" />
  </Svg>
);
export default SvgBrandDribbble;

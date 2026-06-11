import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgListSearch = (props: SvgProps) => (
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
    <Path d="M11 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M18.5 18.5l2.5 2.5" />
    <Path d="M4 6h16" />
    <Path d="M4 12h4" />
    <Path d="M4 18h4" />
  </Svg>
);
export default SvgListSearch;

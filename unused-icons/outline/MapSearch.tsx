import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapSearch = (props: SvgProps) => (
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
    <Path d="M11 18l-2 -1l-6 3v-13l6 -3l6 3l6 -3v7.5" />
    <Path d="M9 4v13" />
    <Path d="M15 7v5" />
    <Path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M20.2 20.2l1.8 1.8" />
  </Svg>
);
export default SvgMapSearch;

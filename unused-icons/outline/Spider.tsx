import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpider = (props: SvgProps) => (
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
    <Path d="M5 4v2l5 5" />
    <Path d="M2.5 9.5l1.5 1.5h6" />
    <Path d="M4 19v-2l6 -6" />
    <Path d="M19 4v2l-5 5" />
    <Path d="M21.5 9.5l-1.5 1.5h-6" />
    <Path d="M20 19v-2l-6 -6" />
    <Path d="M8 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M10 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgSpider;

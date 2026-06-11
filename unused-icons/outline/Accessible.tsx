import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAccessible = (props: SvgProps) => (
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
    <Path d="M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1" />
    <Path d="M11.5 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
  </Svg>
);
export default SvgAccessible;

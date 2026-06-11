import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLayoutNavbarExpand = (props: SvgProps) => (
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
    <Path d="M4 18v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2" />
    <Path d="M4 9h16" />
    <Path d="M10 14l2 2l2 -2" />
  </Svg>
);
export default SvgLayoutNavbarExpand;

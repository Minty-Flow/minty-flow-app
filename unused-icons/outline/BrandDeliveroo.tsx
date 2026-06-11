import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDeliveroo = (props: SvgProps) => (
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
    <Path d="M15 11l1 -9l5 .5l-1 13.5l-3 6l-12.5 -2.5l-1.5 -6l7 -1.5l-1.5 -7.5l4.5 -1l2 7.5" />
    <Path d="M14.5 15.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
    <Path d="M10.5 14.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
  </Svg>
);
export default SvgBrandDeliveroo;

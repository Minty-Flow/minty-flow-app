import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHorseToy = (props: SvgProps) => (
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
    <Path d="M3.5 17.5c5.667 4.667 11.333 4.667 17 0" />
    <Path d="M19 18.5l-2 -8.5l1 -2l2 1l1.5 -1.5l-2.5 -4.5c-5.052 .218 -5.99 3.133 -7 6h-6a3 3 0 0 0 -3 3" />
    <Path d="M5 18.5l2 -9.5" />
    <Path d="M8 20l2 -5h4l2 5" />
  </Svg>
);
export default SvgHorseToy;

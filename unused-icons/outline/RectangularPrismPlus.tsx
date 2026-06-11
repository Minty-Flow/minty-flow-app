import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRectangularPrismPlus = (props: SvgProps) => (
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
    <Path d="M21 12.5v-3.509a1.98 1.98 0 0 0 -1 -1.717l-4 -2.008a2.016 2.016 0 0 0 -2 0l-10 5.007c-.619 .355 -1 1.01 -1 1.718v5.018c0 .709 .381 1.363 1 1.717l4 2.008a2.016 2.016 0 0 0 2 0l2.062 -1.032" />
    <Path d="M9 21v-7.5" />
    <Path d="M9 13.5l11.5 -5.5" />
    <Path d="M3.5 11l5.5 2.5" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgRectangularPrismPlus;

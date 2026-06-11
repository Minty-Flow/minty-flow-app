import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandD3 = (props: SvgProps) => (
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
    <Path d="M3 4h1.8c3.976 0 7.2 3.582 7.2 8s-3.224 8 -7.2 8h-1.8" />
    <Path d="M12 4h5.472c1.948 0 3.528 1.79 3.528 4s-1.58 4 -3.528 4" />
    <Path d="M17.472 12h-2.472" />
    <Path d="M17.472 12h-2.352" />
    <Path d="M17.472 12c1.948 0 3.528 1.79 3.528 4s-1.58 4 -3.528 4h-5.472" />
  </Svg>
);
export default SvgBrandD3;

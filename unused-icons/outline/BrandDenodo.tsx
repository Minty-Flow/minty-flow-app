import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDenodo = (props: SvgProps) => (
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
    <Path d="M11 11h2v2h-2l0 -2" />
    <Path d="M3.634 15.634l1.732 -1l1 1.732l-1.732 1l-1 -1.732" />
    <Path d="M11 19h2v2h-2l0 -2" />
    <Path d="M18.634 14.634l1.732 1l-1 1.732l-1.732 -1l1 -1.732" />
    <Path d="M17.634 7.634l1.732 -1l1 1.732l-1.732 1l-1 -1.732" />
    <Path d="M11 3h2v2h-2l0 -2" />
    <Path d="M3.634 8.366l1 -1.732l1.732 1l-1 1.732l-1.732 -1" />
  </Svg>
);
export default SvgBrandDenodo;

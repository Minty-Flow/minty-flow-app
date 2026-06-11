import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPolymer = (props: SvgProps) => (
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
    <Path d="M6.706 6l-3.706 6l3.706 6h1.059l8.47 -12h1.06l3.705 6l-3.706 6" />
  </Svg>
);
export default SvgBrandPolymer;

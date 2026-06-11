import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandVite = (props: SvgProps) => (
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
    <Path d="M10 4.5l6 -1.5l-2 6.5l2 -.5l-4 7v-5l-3 1l1 -7.5" />
    <Path d="M15 6.5l7 -1.5l-10 17l-10 -17l7.741 1.5" />
  </Svg>
);
export default SvgBrandVite;

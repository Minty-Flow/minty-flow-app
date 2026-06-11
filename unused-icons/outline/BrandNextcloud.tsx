import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandNextcloud = (props: SvgProps) => (
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
    <Path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M2 12.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
    <Path d="M17 12.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
  </Svg>
);
export default SvgBrandNextcloud;

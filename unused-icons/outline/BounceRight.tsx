import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBounceRight = (props: SvgProps) => (
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
    <Path d="M4 15.5c3 -1 5.5 -.5 8 4.5c.5 -3 1.5 -5.5 3 -8" />
    <Path d="M18 9a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
  </Svg>
);
export default SvgBounceRight;

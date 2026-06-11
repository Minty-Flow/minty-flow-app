import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFerry = (props: SvgProps) => (
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
    <Path d="M2 18h15.293c1.02 0 1.972 -.503 2.536 -1.34l2.171 -3.66h-18.479l-1.521 5" />
    <Path d="M14 8l-1 -2" />
    <Path d="M6.107 12.675l1.384 -4.675h8l2.675 4.598" />
  </Svg>
);
export default SvgFerry;

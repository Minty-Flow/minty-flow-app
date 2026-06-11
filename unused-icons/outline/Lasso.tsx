import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLasso = (props: SvgProps) => (
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
    <Path d="M4.028 13.252c-.657 -.972 -1.028 -2.078 -1.028 -3.252c0 -3.866 4.03 -7 9 -7s9 3.134 9 7s-4.03 7 -9 7c-1.913 0 -3.686 -.464 -5.144 -1.255" />
    <Path d="M3 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17c0 1.42 .316 2.805 1 4" />
  </Svg>
);
export default SvgLasso;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyDinar = (props: SvgProps) => (
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
    <Path d="M14 20.01v-.01" />
    <Path d="M6 13l2.386 -.9a1 1 0 0 0 -.095 -1.902l-1.514 -.404a1 1 0 0 1 -.102 -1.9l2.325 -.894" />
    <Path d="M3 14v1a3 3 0 0 0 3 3h4.161a3 3 0 0 0 2.983 -3.32l-1.144 -10.68" />
    <Path d="M16 17l1 1h2a2 2 0 0 0 1.649 -3.131l-2.653 -3.869" />
  </Svg>
);
export default SvgCurrencyDinar;

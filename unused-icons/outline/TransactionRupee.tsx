import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransactionRupee = (props: SvgProps) => (
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
    <Path d="M21 12h-6h1a3 3 0 0 1 0 6h-1l3 3" />
    <Path d="M15 15h6" />
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5h8" />
    <Path d="M7 5v8a3 3 0 0 0 3 3h1" />
  </Svg>
);
export default SvgTransactionRupee;

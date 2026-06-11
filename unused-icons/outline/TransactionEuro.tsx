import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransactionEuro = (props: SvgProps) => (
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
    <Path d="M21 12.8c-.523 -.502 -1.172 -.8 -1.875 -.8c-1.727 0 -3.125 1.791 -3.125 4s1.398 4 3.125 4c.703 0 1.352 -.298 1.874 -.8" />
    <Path d="M15 16h4" />
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5h8" />
    <Path d="M7 5v8a3 3 0 0 0 3 3h1" />
  </Svg>
);
export default SvgTransactionEuro;

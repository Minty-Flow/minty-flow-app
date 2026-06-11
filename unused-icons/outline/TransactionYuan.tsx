import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransactionYuan = (props: SvgProps) => (
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
    <Path d="M15 17h6" />
    <Path d="M15 12l3 4.5" />
    <Path d="M21 12l-3 4.5v4.5" />
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5h8" />
    <Path d="M7 5v8a3 3 0 0 0 3 3h1" />
  </Svg>
);
export default SvgTransactionYuan;

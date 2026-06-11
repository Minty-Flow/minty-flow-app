import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLockDollar = (props: SvgProps) => (
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
    <Path d="M13 21h-6a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10" />
    <Path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    <Path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
    <Path d="M19 21v1m0 -8v1" />
  </Svg>
);
export default SvgLockDollar;

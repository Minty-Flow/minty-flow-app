import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLockOpen2 = (props: SvgProps) => (
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
    <Path d="M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6" />
    <Path d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M13 11v-4a4 4 0 1 1 8 0v4" />
  </Svg>
);
export default SvgLockOpen2;

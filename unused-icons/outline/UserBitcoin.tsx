import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUserBitcoin = (props: SvgProps) => (
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
    <Path d="M17 21v-6m2 0v-1.5m0 9v-1.5m-2 -3h3m-1 0h.5a1.5 1.5 0 0 1 0 3h-3.5m3 -3h.5a1.5 1.5 0 0 0 0 -3h-3.5" />
    <Path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <Path d="M6 21v-2a4 4 0 0 1 4 -4h3" />
  </Svg>
);
export default SvgUserBitcoin;

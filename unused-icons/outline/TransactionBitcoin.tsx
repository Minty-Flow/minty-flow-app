import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransactionBitcoin = (props: SvgProps) => (
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
    <Path d="M15 12h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" />
    <Path d="M16 16h4" />
    <Path d="M16 11v10v-9" />
    <Path d="M19 11v1" />
    <Path d="M19 20v1" />
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5h8" />
    <Path d="M7 5v8a3 3 0 0 0 3 3h1" />
  </Svg>
);
export default SvgTransactionBitcoin;

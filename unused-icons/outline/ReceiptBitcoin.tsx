import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReceiptBitcoin = (props: SvgProps) => (
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
    <Path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
    <Path d="M9 7h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" />
    <Path d="M10 11h4" />
    <Path d="M10 6v10v-9" />
    <Path d="M13 6v1" />
    <Path d="M13 15v1" />
  </Svg>
);
export default SvgReceiptBitcoin;

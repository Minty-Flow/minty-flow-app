import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyBitcoin = (props: SvgProps) => (
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
    <Path d="M6 6h8a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-8" />
    <Path d="M8 6l0 12" />
    <Path d="M8 12l6 0" />
    <Path d="M9 3l0 3" />
    <Path d="M13 3l0 3" />
    <Path d="M9 18l0 3" />
    <Path d="M13 18l0 3" />
  </Svg>
);
export default SvgCurrencyBitcoin;

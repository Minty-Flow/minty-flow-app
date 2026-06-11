import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyEthereum = (props: SvgProps) => (
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
    <Path d="M6 12l6 -9l6 9l-6 9l-6 -9" />
    <Path d="M6 12l6 -3l6 3l-6 2l-6 -2" />
  </Svg>
);
export default SvgCurrencyEthereum;

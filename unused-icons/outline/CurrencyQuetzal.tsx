import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyQuetzal = (props: SvgProps) => (
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
    <Path d="M6 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <Path d="M13 13l5 5" />
  </Svg>
);
export default SvgCurrencyQuetzal;

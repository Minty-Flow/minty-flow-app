import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRupee = (props: SvgProps) => (
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
    <Path d="M18 5h-11h3a4 4 0 0 1 0 8h-3l6 6" />
    <Path d="M7 9l11 0" />
  </Svg>
);
export default SvgCurrencyRupee;

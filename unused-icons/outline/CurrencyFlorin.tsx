import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyFlorin = (props: SvgProps) => (
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
    <Path d="M8 12h8" />
    <Path d="M7 19c1.213 0 2.31 -.723 2.788 -1.838l4.424 -10.324a3.033 3.033 0 0 1 2.788 -1.838" />
  </Svg>
);
export default SvgCurrencyFlorin;

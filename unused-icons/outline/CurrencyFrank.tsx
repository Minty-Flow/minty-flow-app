import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyFrank = (props: SvgProps) => (
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
    <Path d="M17 5h-6a2 2 0 0 0 -2 2v12" />
    <Path d="M7 15h4" />
    <Path d="M9 11h7" />
  </Svg>
);
export default SvgCurrencyFrank;

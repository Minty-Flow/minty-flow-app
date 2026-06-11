import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyLitecoin = (props: SvgProps) => (
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
    <Path d="M18 19h-8.194a2 2 0 0 1 -1.98 -2.283l1.674 -11.717" />
    <Path d="M14 9l-9 4" />
  </Svg>
);
export default SvgCurrencyLitecoin;

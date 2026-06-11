import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyNano = (props: SvgProps) => (
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
    <Path d="M7 20l10 -16" />
    <Path d="M7 12h10" />
    <Path d="M7 16h10" />
    <Path d="M17 20l-10 -16" />
  </Svg>
);
export default SvgCurrencyNano;

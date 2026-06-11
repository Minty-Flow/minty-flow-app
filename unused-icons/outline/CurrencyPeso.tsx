import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyPeso = (props: SvgProps) => (
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
    <Path d="M8 19v-14h3.5a4.5 4.5 0 1 1 0 9h-3.5" />
    <Path d="M18 8h-12" />
    <Path d="M18 11h-12" />
  </Svg>
);
export default SvgCurrencyPeso;

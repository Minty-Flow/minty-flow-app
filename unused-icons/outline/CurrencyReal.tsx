import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyReal = (props: SvgProps) => (
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
    <Path d="M21 6h-4a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-4" />
    <Path d="M4 18v-12h3a3 3 0 1 1 0 6h-3c5.5 0 5 4 6 6" />
    <Path d="M18 6v-2" />
    <Path d="M17 20v-2" />
  </Svg>
);
export default SvgCurrencyReal;

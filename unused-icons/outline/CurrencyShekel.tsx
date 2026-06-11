import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyShekel = (props: SvgProps) => (
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
    <Path d="M6 18v-12h4a4 4 0 0 1 4 4v4" />
    <Path d="M18 6v12h-4a4 4 0 0 1 -4 -4v-4" />
  </Svg>
);
export default SvgCurrencyShekel;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencySom = (props: SvgProps) => (
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
    <Path d="M10 18v-12h-5v10a2 2 0 0 1 -2 2" />
    <Path d="M14 6v12h4a3 3 0 0 0 0 -6h-4h4a3 3 0 0 0 0 -6h-4" />
  </Svg>
);
export default SvgCurrencySom;

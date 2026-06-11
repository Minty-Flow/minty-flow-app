import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyZloty = (props: SvgProps) => (
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
    <Path d="M12 18h-7l7 -7h-7" />
    <Path d="M17 18v-13" />
    <Path d="M14 14.5l6 -3.5" />
  </Svg>
);
export default SvgCurrencyZloty;

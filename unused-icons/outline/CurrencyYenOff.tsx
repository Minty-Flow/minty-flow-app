import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyYenOff = (props: SvgProps) => (
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
    <Path d="M12 19v-7m5 -7l-3.328 4.66" />
    <Path d="M8 17h8" />
    <Path d="M8 13h5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCurrencyYenOff;

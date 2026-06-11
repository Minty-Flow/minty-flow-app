import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyYen = (props: SvgProps) => (
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
    <Path d="M12 19v-7l-5 -7m10 0l-5 7" />
    <Path d="M8 17l8 0" />
    <Path d="M8 13l8 0" />
  </Svg>
);
export default SvgCurrencyYen;

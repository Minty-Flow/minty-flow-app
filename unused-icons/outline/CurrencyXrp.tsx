import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyXrp = (props: SvgProps) => (
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
    <Path d="M5 5l3.585 3.585a4.83 4.83 0 0 0 6.83 0l3.585 -3.585" />
    <Path d="M5 19l3.585 -3.585a4.83 4.83 0 0 1 6.83 0l3.585 3.584" />
  </Svg>
);
export default SvgCurrencyXrp;

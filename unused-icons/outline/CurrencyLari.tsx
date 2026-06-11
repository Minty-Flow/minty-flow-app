import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyLari = (props: SvgProps) => (
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
    <Path d="M18 13a6 6 0 1 0 -6 6" />
    <Path d="M6 19h12" />
    <Path d="M10 5v7" />
    <Path d="M14 12v-7" />
  </Svg>
);
export default SvgCurrencyLari;

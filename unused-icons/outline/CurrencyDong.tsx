import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyDong = (props: SvgProps) => (
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
    <Path d="M6 19h12" />
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M16 16v-12" />
    <Path d="M17 5h-4" />
  </Svg>
);
export default SvgCurrencyDong;

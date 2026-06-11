import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCashBanknote = (props: SvgProps) => (
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
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M3 8a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M18 12h.01" />
    <Path d="M6 12h.01" />
  </Svg>
);
export default SvgCashBanknote;

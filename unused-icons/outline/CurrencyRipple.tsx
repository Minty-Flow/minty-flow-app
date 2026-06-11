import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRipple = (props: SvgProps) => (
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
    <Path d="M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M10 12h3l2 -2.5" />
    <Path d="M15 14.5l-2 -2.5" />
  </Svg>
);
export default SvgCurrencyRipple;

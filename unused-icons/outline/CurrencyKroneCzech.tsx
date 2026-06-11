import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyKroneCzech = (props: SvgProps) => (
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
    <Path d="M5 6v12" />
    <Path d="M5 12c3.5 0 6 -3 6 -6" />
    <Path d="M5 12c3.5 0 6 3 6 6" />
    <Path d="M19 6l-2 2l-2 -2" />
    <Path d="M19 12h-2a3 3 0 0 0 0 6h2" />
  </Svg>
);
export default SvgCurrencyKroneCzech;

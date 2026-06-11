import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyWon = (props: SvgProps) => (
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
    <Path d="M4 6l3.245 11.358a.85 .85 0 0 0 1.624 .035l3.131 -9.393l3.131 9.393a.85 .85 0 0 0 1.624 -.035l3.245 -11.358" />
    <Path d="M21 10h-18" />
    <Path d="M21 14h-18" />
  </Svg>
);
export default SvgCurrencyWon;

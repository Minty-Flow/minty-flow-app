import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyDollarAustralian = (props: SvgProps) => (
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
    <Path d="M3 18l3.279 -11.476a.75 .75 0 0 1 1.442 0l3.279 11.476" />
    <Path d="M21 6h-4a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-4" />
    <Path d="M17 20v-2" />
    <Path d="M18 6v-2" />
    <Path d="M4.5 14h5" />
  </Svg>
);
export default SvgCurrencyDollarAustralian;

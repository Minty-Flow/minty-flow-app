import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyDollarGuyanese = (props: SvgProps) => (
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
    <Path d="M21 6h-4a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-4" />
    <Path d="M10 6h-3a4 4 0 0 0 -4 4v4a4 4 0 0 0 4 4h3v-6h-2" />
    <Path d="M17 20v-2" />
    <Path d="M18 6v-2" />
  </Svg>
);
export default SvgCurrencyDollarGuyanese;

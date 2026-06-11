import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyForint = (props: SvgProps) => (
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
    <Path d="M11 4h-4a3 3 0 0 0 -3 3v12" />
    <Path d="M10 11h-6" />
    <Path d="M16 4v13a2 2 0 0 0 2 2h2" />
    <Path d="M19 9h-5" />
  </Svg>
);
export default SvgCurrencyForint;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyLira = (props: SvgProps) => (
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
    <Path d="M10 5v15a7 7 0 0 0 7 -7" />
    <Path d="M6 15l8 -4" />
    <Path d="M14 7l-8 4" />
  </Svg>
);
export default SvgCurrencyLira;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyKip = (props: SvgProps) => (
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
    <Path d="M6 12h12" />
    <Path d="M9 5v14" />
    <Path d="M16 19a7 7 0 0 0 -7 -7a7 7 0 0 0 7 -7" />
  </Svg>
);
export default SvgCurrencyKip;

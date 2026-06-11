import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyAfghani = (props: SvgProps) => (
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
    <Path d="M15 13h-3.5a3.5 3.5 0 1 1 3.5 -3.5v6.5h-7" />
    <Path d="M12 3v.01" />
    <Path d="M12 19v2" />
  </Svg>
);
export default SvgCurrencyAfghani;

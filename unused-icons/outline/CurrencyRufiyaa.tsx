import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRufiyaa = (props: SvgProps) => (
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
    <Path d="M20 16h.01" />
    <Path d="M4 16c9.5 -4 11.5 -8 14 -9" />
    <Path d="M12 8l5 3" />
  </Svg>
);
export default SvgCurrencyRufiyaa;

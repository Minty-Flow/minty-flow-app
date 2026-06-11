import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyTugrik = (props: SvgProps) => (
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
    <Path d="M7 6h10" />
    <Path d="M12 6v13" />
    <Path d="M8 17l8 -3" />
    <Path d="M16 10l-8 3" />
  </Svg>
);
export default SvgCurrencyTugrik;

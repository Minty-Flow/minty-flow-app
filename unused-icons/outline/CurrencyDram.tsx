import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyDram = (props: SvgProps) => (
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
    <Path d="M4 10a6 6 0 1 1 12 0v10" />
    <Path d="M12 16h8" />
    <Path d="M12 12h8" />
  </Svg>
);
export default SvgCurrencyDram;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTerminal = (props: SvgProps) => (
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
    <Path d="M5 7l5 5l-5 5" />
    <Path d="M12 19l7 0" />
  </Svg>
);
export default SvgTerminal;

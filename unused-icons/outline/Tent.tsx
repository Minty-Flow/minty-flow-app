import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTent = (props: SvgProps) => (
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
    <Path d="M11 14l4 6h6l-9 -16l-9 16h6l4 -6" />
  </Svg>
);
export default SvgTent;

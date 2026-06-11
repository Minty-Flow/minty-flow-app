import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClearAll = (props: SvgProps) => (
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
    <Path d="M8 6h12" />
    <Path d="M6 12h12" />
    <Path d="M4 18h12" />
  </Svg>
);
export default SvgClearAll;

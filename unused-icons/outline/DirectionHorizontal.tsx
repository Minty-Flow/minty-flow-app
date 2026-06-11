import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDirectionHorizontal = (props: SvgProps) => (
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
    <Path d="M10 9l-3 3l3 3" />
    <Path d="M14 9l3 3l-3 3" />
  </Svg>
);
export default SvgDirectionHorizontal;

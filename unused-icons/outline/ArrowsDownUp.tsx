import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDownUp = (props: SvgProps) => (
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
    <Path d="M17 3l0 18" />
    <Path d="M10 18l-3 3l-3 -3" />
    <Path d="M7 21l0 -18" />
    <Path d="M20 6l-3 -3l-3 3" />
  </Svg>
);
export default SvgArrowsDownUp;

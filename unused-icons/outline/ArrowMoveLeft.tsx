import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowMoveLeft = (props: SvgProps) => (
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
    <Path d="M13 12h-10" />
    <Path d="M6 15l-3 -3l3 -3" />
    <Path d="M17 12a2 2 0 1 1 4 0a2 2 0 0 1 -4 0" />
  </Svg>
);
export default SvgArrowMoveLeft;

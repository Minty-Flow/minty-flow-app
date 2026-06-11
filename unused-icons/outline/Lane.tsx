import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLane = (props: SvgProps) => (
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
    <Path d="M4 6v13" />
    <Path d="M20 6v13" />
  </Svg>
);
export default SvgLane;

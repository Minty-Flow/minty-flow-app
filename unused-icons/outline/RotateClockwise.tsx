import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRotateClockwise = (props: SvgProps) => (
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
    <Path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
  </Svg>
);
export default SvgRotateClockwise;

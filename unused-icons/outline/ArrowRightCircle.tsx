import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRightCircle = (props: SvgProps) => (
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
    <Path d="M18 15l3 -3l-3 -3" />
    <Path d="M3 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 12h14" />
  </Svg>
);
export default SvgArrowRightCircle;

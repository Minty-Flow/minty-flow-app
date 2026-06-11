import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryLastRight = (props: SvgProps) => (
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
    <Path d="M6 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9 15v6" />
    <Path d="M11.5 9.5l6.5 -6.5" />
    <Path d="M13 3h5v5" />
  </Svg>
);
export default SvgArrowRotaryLastRight;

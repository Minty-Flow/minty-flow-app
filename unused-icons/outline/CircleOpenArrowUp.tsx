import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleOpenArrowUp = (props: SvgProps) => (
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
    <Path d="M15.998 20.066a9 9 0 1 0 -3.998 .934v-13" />
    <Path d="M16 12l-4 -4l-4 4" />
  </Svg>
);
export default SvgCircleOpenArrowUp;

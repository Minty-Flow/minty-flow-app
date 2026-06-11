import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampRight2 = (props: SvgProps) => (
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
    <Path d="M6 3v8.707" />
    <Path d="M16 14l4 -4l-4 -4" />
    <Path d="M6 21c0 -6.075 4.925 -11 11 -11h3" />
  </Svg>
);
export default SvgArrowRampRight2;

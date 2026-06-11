import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampLeft2 = (props: SvgProps) => (
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
    <Path d="M18 3v8.707" />
    <Path d="M8 14l-4 -4l4 -4" />
    <Path d="M18 21c0 -6.075 -4.925 -11 -11 -11h-3" />
  </Svg>
);
export default SvgArrowRampLeft2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampLeft3 = (props: SvgProps) => (
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
    <Path d="M18 3v6" />
    <Path d="M8 16l-4 -4l4 -4" />
    <Path d="M18 21v-6a3 3 0 0 0 -3 -3h-11" />
  </Svg>
);
export default SvgArrowRampLeft3;

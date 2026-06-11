import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampRight3 = (props: SvgProps) => (
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
    <Path d="M6 3v6" />
    <Path d="M16 16l4 -4l-4 -4" />
    <Path d="M6 21v-6a3 3 0 0 1 3 -3h11" />
  </Svg>
);
export default SvgArrowRampRight3;

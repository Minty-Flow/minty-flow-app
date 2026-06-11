import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSword = (props: SvgProps) => (
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
    <Path d="M20 4v5l-9 7l-4 4l-3 -3l4 -4l7 -9l5 0" />
    <Path d="M6.5 11.5l6 6" />
  </Svg>
);
export default SvgSword;

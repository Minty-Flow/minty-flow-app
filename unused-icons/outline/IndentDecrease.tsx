import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIndentDecrease = (props: SvgProps) => (
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
    <Path d="M20 6l-7 0" />
    <Path d="M20 12l-9 0" />
    <Path d="M20 18l-7 0" />
    <Path d="M8 8l-4 4l4 4" />
  </Svg>
);
export default SvgIndentDecrease;

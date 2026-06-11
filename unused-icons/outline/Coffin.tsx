import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCoffin = (props: SvgProps) => (
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
    <Path d="M7 3l-2 6l2 12h6l2 -12l-2 -6l-6 0" />
    <Path d="M10 7v5" />
    <Path d="M8 9h4" />
    <Path d="M13 21h4l2 -12l-2 -6h-4" />
  </Svg>
);
export default SvgCoffin;

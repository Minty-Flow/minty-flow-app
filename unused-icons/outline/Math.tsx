import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMath = (props: SvgProps) => (
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
    <Path d="M19 5h-7l-4 14l-3 -6h-2" />
    <Path d="M14 13l6 6" />
    <Path d="M14 19l6 -6" />
  </Svg>
);
export default SvgMath;

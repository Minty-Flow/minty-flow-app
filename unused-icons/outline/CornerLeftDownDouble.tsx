import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCornerLeftDownDouble = (props: SvgProps) => (
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
    <Path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
    <Path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
  </Svg>
);
export default SvgCornerLeftDownDouble;

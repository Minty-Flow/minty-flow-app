import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPnpm = (props: SvgProps) => (
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
    <Path d="M3 17h4v4h-4l0 -4" />
    <Path d="M10 17h4v4h-4l0 -4" />
    <Path d="M17 17h4v4h-4l0 -4" />
    <Path d="M17 10h4v4h-4l0 -4" />
    <Path d="M17 3h4v4h-4l0 -4" />
    <Path d="M10 10h4v4h-4l0 -4" />
    <Path d="M10 3h4v4h-4l0 -4" />
    <Path d="M3 3h4v4h-4l0 -4" />
  </Svg>
);
export default SvgBrandPnpm;

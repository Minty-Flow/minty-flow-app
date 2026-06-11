import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWallpaperOff = (props: SvgProps) => (
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
    <Path d="M10 6h8a2 2 0 0 1 2 2v8m-.58 3.409a2 2 0 0 1 -1.42 .591h-12" />
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M8 18v-10m-3.427 -3.402c-.353 .362 -.573 .856 -.573 1.402v12" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWallpaperOff;

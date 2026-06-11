import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWallpaper = (props: SvgProps) => (
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
    <Path d="M8 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-12" />
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M8 18v-12a2 2 0 1 0 -4 0v12" />
  </Svg>
);
export default SvgWallpaper;

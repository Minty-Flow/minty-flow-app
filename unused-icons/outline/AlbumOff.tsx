import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlbumOff = (props: SvgProps) => (
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
    <Path d="M8 4h10a2 2 0 0 1 2 2v10m-.581 3.41c-.362 .364 -.864 .59 -1.419 .59h-12a2 2 0 0 1 -2 -2v-12c0 -.552 .224 -1.052 .585 -1.413" />
    <Path d="M12 4v4m1.503 1.497l.497 -.497l2 2v-7" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAlbumOff;

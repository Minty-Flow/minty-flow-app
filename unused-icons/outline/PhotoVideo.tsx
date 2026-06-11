import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoVideo = (props: SvgProps) => (
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
    <Path d="M9 15h-3a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v3" />
    <Path d="M9 12a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3l0 -6" />
    <Path d="M3 12l2.296 -2.296a2.41 2.41 0 0 1 3.408 0l.296 .296" />
    <Path d="M14 13.5v3l2.5 -1.5l-2.5 -1.5" />
    <Path d="M7 6v.01" />
  </Svg>
);
export default SvgPhotoVideo;

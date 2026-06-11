import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoCircle = (props: SvgProps) => (
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
    <Path d="M15 8h.01" />
    <Path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l5 5" />
    <Path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2 2" />
    <Path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9" />
  </Svg>
);
export default SvgPhotoCircle;

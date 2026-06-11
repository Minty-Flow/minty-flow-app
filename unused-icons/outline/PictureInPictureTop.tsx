import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPictureInPictureTop = (props: SvgProps) => (
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
    <Path d="M11 5h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-4" />
    <Path d="M15 10h5a1 1 0 0 0 1 -1v-3a1 1 0 0 0 -1 -1h-5a1 1 0 0 0 -1 1v3a1 1 0 0 0 1 1" />
  </Svg>
);
export default SvgPictureInPictureTop;

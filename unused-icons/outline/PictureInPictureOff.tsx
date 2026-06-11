import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPictureInPictureOff = (props: SvgProps) => (
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
    <Path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
    <Path d="M14 15a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1l0 -3" />
    <Path d="M7 9l4 4" />
    <Path d="M7 12v-3h3" />
  </Svg>
);
export default SvgPictureInPictureOff;

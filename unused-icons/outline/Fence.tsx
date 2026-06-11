import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFence = (props: SvgProps) => (
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
    <Path d="M4 12v4h16v-4l-16 0" />
    <Path d="M6 16v4h4v-4m0 -4v-6l-2 -2l-2 2v6" />
    <Path d="M14 16v4h4v-4m0 -4v-6l-2 -2l-2 2v6" />
  </Svg>
);
export default SvgFence;

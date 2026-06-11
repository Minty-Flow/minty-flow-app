import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFenceOff = (props: SvgProps) => (
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
    <Path d="M12 12h-8v4h12m4 0v-4h-4" />
    <Path d="M6 16v4h4v-4" />
    <Path d="M10 12v-2m0 -4l-2 -2m-2 2v6" />
    <Path d="M14 16v4h4v-2" />
    <Path d="M18 12v-6l-2 -2l-2 2v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFenceOff;

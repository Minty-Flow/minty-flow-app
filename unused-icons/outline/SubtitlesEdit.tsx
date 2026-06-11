import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSubtitlesEdit = (props: SvgProps) => (
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
    <Path d="M11.5 19h-5.5a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v3" />
    <Path d="M7 15h5" />
    <Path d="M17 12h-3" />
    <Path d="M11 12h-1" />
    <Path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39" />
  </Svg>
);
export default SvgSubtitlesEdit;

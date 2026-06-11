import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPresentationOff = (props: SvgProps) => (
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
    <Path d="M3 4h1m4 0h13" />
    <Path d="M4 4v10a2 2 0 0 0 2 2h10m3.42 -.592c.359 -.362 .58 -.859 .58 -1.408v-10" />
    <Path d="M12 16v4" />
    <Path d="M9 20h6" />
    <Path d="M8 12l2 -2m4 0l2 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPresentationOff;

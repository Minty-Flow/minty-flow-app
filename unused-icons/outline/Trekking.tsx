import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrekking = (props: SvgProps) => (
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
    <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 21l2 -4" />
    <Path d="M13 21v-4l-3 -3l1 -6l3 4l3 2" />
    <Path d="M10 14l-1.827 -1.218a2 2 0 0 1 -.831 -2.15l.28 -1.117a2 2 0 0 1 1.939 -1.515h1.439l4 1l3 -2" />
    <Path d="M17 12v9" />
    <Path d="M16 20h2" />
  </Svg>
);
export default SvgTrekking;

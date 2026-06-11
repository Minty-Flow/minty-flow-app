import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCarCrane = (props: SvgProps) => (
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
    <Path d="M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 18h8m4 0h2v-6a5 5 0 0 0 -5 -5h-1l1.5 5h4.5" />
    <Path d="M12 18v-11h3" />
    <Path d="M3 17v-5h9" />
    <Path d="M4 12v-6l18 -3v2" />
    <Path d="M8 12v-4l-4 -2" />
  </Svg>
);
export default SvgCarCrane;

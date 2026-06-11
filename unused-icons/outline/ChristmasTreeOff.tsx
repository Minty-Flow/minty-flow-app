import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChristmasTreeOff = (props: SvgProps) => (
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
    <Path d="M9.5 5.5l2.5 -2.5l4 4l-2 1l4 4l-1.5 .5m.5 4.5h-12l4 -4l-3 -1l3 -3" />
    <Path d="M14 17v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgChristmasTreeOff;

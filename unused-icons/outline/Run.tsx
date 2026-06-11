import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRun = (props: SvgProps) => (
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
    <Path d="M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M4 17l5 1l.75 -1.5" />
    <Path d="M15 21l0 -4l-4 -3l1 -6" />
    <Path d="M7 12l0 -3l5 -1l3 3l3 1" />
  </Svg>
);
export default SvgRun;

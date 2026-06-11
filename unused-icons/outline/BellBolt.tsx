import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBellBolt = (props: SvgProps) => (
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
    <Path d="M13.5 17h-9.5a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v1" />
    <Path d="M9 17v1a3 3 0 0 0 4.368 2.67" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgBellBolt;

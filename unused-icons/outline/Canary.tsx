import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCanary = (props: SvgProps) => (
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
    <Path d="M12 20v-2" />
    <Path d="M15 8.01v.01" />
    <Path d="M3 17l8 -8v-1a4 4 0 1 1 8 0h2l-2 2v1a7 7 0 0 1 -13.215 3.223" />
  </Svg>
);
export default SvgCanary;

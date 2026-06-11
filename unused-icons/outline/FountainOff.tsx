import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFountainOff = (props: SvgProps) => (
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
    <Path d="M9 16v-5a2 2 0 1 0 -4 0" />
    <Path d="M15 16v-1m0 -4a2 2 0 1 1 4 0" />
    <Path d="M12 16v-4m0 -4v-2a3 3 0 0 1 6 0" />
    <Path d="M7.451 3.43a3 3 0 0 1 4.549 2.57" />
    <Path d="M20 16h1v1m-.871 3.114a2.99 2.99 0 0 1 -2.129 .886h-12a3 3 0 0 1 -3 -3v-2h13" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFountainOff;

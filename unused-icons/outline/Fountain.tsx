import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFountain = (props: SvgProps) => (
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
    <Path d="M15 16v-5a2 2 0 1 1 4 0" />
    <Path d="M12 16v-10a3 3 0 0 1 6 0" />
    <Path d="M6 6a3 3 0 0 1 6 0" />
    <Path d="M3 16h18v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  </Svg>
);
export default SvgFountain;

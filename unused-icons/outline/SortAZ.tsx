import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortAZ = (props: SvgProps) => (
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
    <Path d="M16 8h4l-4 8h4" />
    <Path d="M4 16v-6a2 2 0 1 1 4 0v6" />
    <Path d="M4 13h4" />
    <Path d="M11 12h2" />
  </Svg>
);
export default SvgSortAZ;

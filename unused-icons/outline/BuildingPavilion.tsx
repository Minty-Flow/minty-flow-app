import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingPavilion = (props: SvgProps) => (
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
    <Path d="M3 21h7v-3a2 2 0 0 1 4 0v3h7" />
    <Path d="M6 21l0 -9" />
    <Path d="M18 21l0 -9" />
    <Path d="M6 12h12a3 3 0 0 0 3 -3a9 8 0 0 1 -9 -6a9 8 0 0 1 -9 6a3 3 0 0 0 3 3" />
  </Svg>
);
export default SvgBuildingPavilion;

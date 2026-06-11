import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToolsKitchen3 = (props: SvgProps) => (
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
    <Path d="M7 4v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
    <Path d="M14 8a3 4 0 1 0 6 0a3 4 0 1 0 -6 0" />
    <Path d="M17 12v9" />
  </Svg>
);
export default SvgToolsKitchen3;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRegistered = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M10 15v-6h2a2 2 0 1 1 0 4h-2" />
    <Path d="M14 15l-2 -2" />
  </Svg>
);
export default SvgRegistered;

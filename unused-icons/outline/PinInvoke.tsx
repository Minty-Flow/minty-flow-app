import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPinInvoke = (props: SvgProps) => (
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
    <Path d="M21 13v5a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h9" />
    <Path d="M17 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 11h4v4" />
    <Path d="M10 15l4 -4" />
  </Svg>
);
export default SvgPinInvoke;

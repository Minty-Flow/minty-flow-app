import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumber6 = (props: SvgProps) => (
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
    <Path d="M8 16a4 4 0 1 0 8 0v-1a4 4 0 1 0 -8 0" />
    <Path d="M16 8a4 4 0 1 0 -8 0v8" />
  </Svg>
);
export default SvgNumber6;

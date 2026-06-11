import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumber10 = (props: SvgProps) => (
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
    <Path d="M8 20v-16l-5 5" />
    <Path d="M16 20a4 4 0 0 0 4 -4v-8a4 4 0 1 0 -8 0v8a4 4 0 0 0 4 4" />
  </Svg>
);
export default SvgNumber10;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumber10Small = (props: SvgProps) => (
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
    <Path d="M8 8h1v8" />
    <Path d="M14 10v4a2 2 0 1 0 4 0v-4a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgNumber10Small;

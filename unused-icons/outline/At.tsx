import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAt = (props: SvgProps) => (
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
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
  </Svg>
);
export default SvgAt;

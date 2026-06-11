import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumnRemove = (props: SvgProps) => (
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
    <Path d="M6 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
    <Path d="M16 10l4 4" />
    <Path d="M16 14l4 -4" />
  </Svg>
);
export default SvgColumnRemove;

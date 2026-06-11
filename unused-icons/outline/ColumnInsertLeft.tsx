import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumnInsertLeft = (props: SvgProps) => (
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
    <Path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
    <Path d="M5 12l4 0" />
    <Path d="M7 10l0 4" />
  </Svg>
);
export default SvgColumnInsertLeft;

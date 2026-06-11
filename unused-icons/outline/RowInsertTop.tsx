import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRowInsertTop = (props: SvgProps) => (
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
    <Path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1" />
    <Path d="M12 9v-4" />
    <Path d="M10 7l4 0" />
  </Svg>
);
export default SvgRowInsertTop;

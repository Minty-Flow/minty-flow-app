import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpTail = (props: SvgProps) => (
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
    <Path d="M12 18l0 -15" />
    <Path d="M15 6l-3 -3l-3 3" />
    <Path d="M15 21l-3 -3l-3 3" />
  </Svg>
);
export default SvgArrowUpTail;

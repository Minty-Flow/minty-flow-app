import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpRhombus = (props: SvgProps) => (
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
    <Path d="M12 16v-13" />
    <Path d="M15 6l-3 -3l-3 3" />
    <Path d="M14.5 18.5l-2.5 2.5l-2.5 -2.5l2.5 -2.5l2.5 2.5" />
  </Svg>
);
export default SvgArrowUpRhombus;

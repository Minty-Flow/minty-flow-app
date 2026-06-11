import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowDownRhombus = (props: SvgProps) => (
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
    <Path d="M12 8v13" />
    <Path d="M15 18l-3 3l-3 -3" />
    <Path d="M14.5 5.5l-2.5 -2.5l-2.5 2.5l2.5 2.5l2.5 -2.5" />
  </Svg>
);
export default SvgArrowDownRhombus;

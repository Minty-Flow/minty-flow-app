import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowDownCircle = (props: SvgProps) => (
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
    <Path d="M12 7v14" />
    <Path d="M9 18l3 3l3 -3" />
    <Path d="M12 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
  </Svg>
);
export default SvgArrowDownCircle;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarBoth = (props: SvgProps) => (
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
    <Path d="M8 12h-6" />
    <Path d="M5 15l-3 -3l3 -3" />
    <Path d="M22 12h-6" />
    <Path d="M19 15l3 -3l-3 -3" />
    <Path d="M12 4v16" />
  </Svg>
);
export default SvgArrowBarBoth;

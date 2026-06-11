import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarToUpDashed = (props: SvgProps) => (
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
    <Path d="M12 10v10" />
    <Path d="M12 10l4 4" />
    <Path d="M12 10l-4 4" />
    <Path d="M4 4h3m13 0h-3m-3.5 0h-3" />
  </Svg>
);
export default SvgArrowBarToUpDashed;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarToDownDashed = (props: SvgProps) => (
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
    <Path d="M12 14v-10" />
    <Path d="M12 14l4 -4" />
    <Path d="M12 14l-4 -4" />
    <Path d="M4 20h3m13 0h-3m-3.5 0h-3" />
  </Svg>
);
export default SvgArrowBarToDownDashed;

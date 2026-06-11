import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarDown = (props: SvgProps) => (
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
    <Path d="M12 20l0 -10" />
    <Path d="M12 20l4 -4" />
    <Path d="M12 20l-4 -4" />
    <Path d="M4 4l16 0" />
  </Svg>
);
export default SvgArrowBarDown;

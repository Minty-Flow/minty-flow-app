import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStepOut = (props: SvgProps) => (
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
    <Path d="M12 3l0 12" />
    <Path d="M16 7l-4 -4" />
    <Path d="M8 7l4 -4" />
    <Path d="M11 20a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgStepOut;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRotate = (props: SvgProps) => (
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
    <Path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
  </Svg>
);
export default SvgRotate;

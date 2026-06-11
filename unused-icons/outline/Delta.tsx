import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDelta = (props: SvgProps) => (
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
    <Path d="M4 20h16l-8 -16l-8 16" />
  </Svg>
);
export default SvgDelta;

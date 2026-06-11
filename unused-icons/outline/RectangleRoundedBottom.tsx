import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRectangleRoundedBottom = (props: SvgProps) => (
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
    <Path d="M9 18h6a6 6 0 0 0 6 -6v-5a1 1 0 0 0 -1 -1h-16a1 1 0 0 0 -1 1v5a6 6 0 0 0 6 6" />
  </Svg>
);
export default SvgRectangleRoundedBottom;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpSquare = (props: SvgProps) => (
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
    <Path d="M12 17l0 -14" />
    <Path d="M15 6l-3 -3l-3 3" />
    <Path d="M10 21v-4h4v4l-4 0" />
  </Svg>
);
export default SvgArrowUpSquare;

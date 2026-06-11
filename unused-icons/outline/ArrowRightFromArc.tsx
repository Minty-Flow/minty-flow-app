import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRightFromArc = (props: SvgProps) => (
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
    <Path d="M15 12h-12" />
    <Path d="M7 8l-4 4l4 4" />
    <Path d="M12 21a9 9 0 0 0 0 -18" />
  </Svg>
);
export default SvgArrowRightFromArc;

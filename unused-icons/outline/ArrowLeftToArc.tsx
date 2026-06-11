import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLeftToArc = (props: SvgProps) => (
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
    <Path d="M21 12h-12" />
    <Path d="M13 16l-4 -4l4 -4" />
    <Path d="M12 3a9 9 0 1 0 0 18" />
  </Svg>
);
export default SvgArrowLeftToArc;

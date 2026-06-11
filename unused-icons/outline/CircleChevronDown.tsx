import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleChevronDown = (props: SvgProps) => (
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
    <Path d="M15 11l-3 3l-3 -3" />
    <Path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18" />
  </Svg>
);
export default SvgCircleChevronDown;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowMergeRight = (props: SvgProps) => (
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
    <Path d="M16 8l-4 -4l-4 4" />
    <Path d="M12 20v-16" />
    <Path d="M18 18c-4 -1.333 -6 -4.667 -6 -10" />
  </Svg>
);
export default SvgArrowMergeRight;

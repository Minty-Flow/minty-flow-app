import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowCapsule = (props: SvgProps) => (
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
    <Path d="M18 15a6 6 0 1 1 -12 0v-6a6 6 0 1 1 12 0v2" />
    <Path d="M15 8l3 3l3 -3" />
  </Svg>
);
export default SvgArrowCapsule;

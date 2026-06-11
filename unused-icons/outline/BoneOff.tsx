import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoneOff = (props: SvgProps) => (
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
    <Path d="M12.5 8.502l.38 -.38a3 3 0 1 1 5.12 -2.122a3 3 0 1 1 -2.12 5.122l-.372 .372m-2.008 2.008l-2.378 2.378a3 3 0 1 1 -5.117 2.297l0 -.177l-.176 0a3 3 0 1 1 2.298 -5.115l2.378 -2.378" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBoneOff;

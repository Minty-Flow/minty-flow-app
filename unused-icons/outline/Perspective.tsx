import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPerspective = (props: SvgProps) => (
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
    <Path d="M6.141 4.163l12 1.714a1 1 0 0 1 .859 .99v10.266a1 1 0 0 1 -.859 .99l-12 1.714a1 1 0 0 1 -1.141 -.99v-13.694a1 1 0 0 1 1.141 -.99" />
  </Svg>
);
export default SvgPerspective;

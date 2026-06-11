import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHeartCheck = (props: SvgProps) => (
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
    <Path d="M19.5 12.572l-3 2.928m-5.5 3.5a8916.99 8916.99 0 0 0 -6.5 -6.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgHeartCheck;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlignBoxCenterTop = (props: SvgProps) => (
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
    <Path d="M3 19v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2" />
    <Path d="M11 13h2" />
    <Path d="M9 10h6" />
    <Path d="M10 7h4" />
  </Svg>
);
export default SvgAlignBoxCenterTop;

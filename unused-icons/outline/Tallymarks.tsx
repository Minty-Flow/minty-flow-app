import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTallymarks = (props: SvgProps) => (
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
    <Path d="M6 5l0 14" />
    <Path d="M10 5l0 14" />
    <Path d="M14 5l0 14" />
    <Path d="M18 5l0 14" />
    <Path d="M3 17l18 -10" />
  </Svg>
);
export default SvgTallymarks;

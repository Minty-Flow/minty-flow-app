import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCapStraight = (props: SvgProps) => (
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
    <Path d="M8 12a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M8 12h12" />
    <Path d="M20 6h-12a2 2 0 0 0 -2 2v2" />
    <Path d="M6 14v2a2 2 0 0 0 2 2h12" />
  </Svg>
);
export default SvgCapStraight;

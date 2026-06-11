import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayerTrackNext = (props: SvgProps) => (
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
    <Path d="M3 5v14l8 -7l-8 -7" />
    <Path d="M14 5v14l8 -7l-8 -7" />
  </Svg>
);
export default SvgPlayerTrackNext;

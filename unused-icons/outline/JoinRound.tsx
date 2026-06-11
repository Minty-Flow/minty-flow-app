import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgJoinRound = (props: SvgProps) => (
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
    <Path d="M6 4h3a2 2 0 0 1 2 2v6a1 1 0 0 0 1 1h6a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-6a8 8 0 0 1 -8 -8v-6a2 2 0 0 1 2 -2" />
  </Svg>
);
export default SvgJoinRound;

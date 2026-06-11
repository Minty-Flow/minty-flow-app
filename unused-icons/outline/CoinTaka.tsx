import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCoinTaka = (props: SvgProps) => (
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
    <Path d="M8 8l.553 -.276a1 1 0 0 1 1.447 .894v6.382a2 2 0 0 0 2 2h.5a2.5 2.5 0 0 0 2.5 -2.5v-.5h-1" />
    <Path d="M8 11h7" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  </Svg>
);
export default SvgCoinTaka;

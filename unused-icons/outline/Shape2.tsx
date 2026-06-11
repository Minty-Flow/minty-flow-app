import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShape2 = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6.5 17.5l11 -11m-12.5 .5v10m14 -10v10" />
  </Svg>
);
export default SvgShape2;

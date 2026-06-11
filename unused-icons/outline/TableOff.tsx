import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTableOff = (props: SvgProps) => (
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
    <Path d="M7 3h12a2 2 0 0 1 2 2v12m-.585 3.413a1.994 1.994 0 0 1 -1.415 .587h-14a2 2 0 0 1 -2 -2v-14c0 -.55 .223 -1.05 .583 -1.412" />
    <Path d="M3 10h7m4 0h7" />
    <Path d="M10 3v3m0 4v11" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTableOff;

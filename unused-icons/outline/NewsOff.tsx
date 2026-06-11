import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNewsOff = (props: SvgProps) => (
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
    <Path d="M16 6h3a1 1 0 0 1 1 1v9m-.606 3.435a2 2 0 0 1 -3.394 -1.435v-2m0 -4v-7a1 1 0 0 0 -1 -1h-7m-3.735 .321a1 1 0 0 0 -.265 .679v12a3 3 0 0 0 3 3h11" />
    <Path d="M8 12h4" />
    <Path d="M8 16h4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgNewsOff;

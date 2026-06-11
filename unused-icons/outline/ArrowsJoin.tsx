import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsJoin = (props: SvgProps) => (
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
    <Path d="M3 7h5l3.5 5h9.5" />
    <Path d="M3 17h5l3.495 -5" />
    <Path d="M18 15l3 -3l-3 -3" />
  </Svg>
);
export default SvgArrowsJoin;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrendingUp3 = (props: SvgProps) => (
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
    <Path d="M18 5l3 3l-3 3" />
    <Path d="M3 18h2.397a5 5 0 0 0 4.096 -2.133l4.014 -5.734a5 5 0 0 1 4.096 -2.133h3.397" />
  </Svg>
);
export default SvgTrendingUp3;

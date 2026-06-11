import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartFunnel = (props: SvgProps) => (
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
    <Path d="M4.387 3h15.226a1 1 0 0 1 .948 1.316l-5.105 15.316a2 2 0 0 1 -1.898 1.368h-3.116a2 2 0 0 1 -1.898 -1.368l-5.104 -15.316a1 1 0 0 1 .947 -1.316" />
    <Path d="M5 9h14" />
    <Path d="M7 15h10" />
  </Svg>
);
export default SvgChartFunnel;

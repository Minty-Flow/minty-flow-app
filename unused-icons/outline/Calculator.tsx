import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCalculator = (props: SvgProps) => (
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
    <Path d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1" />
    <Path d="M8 14l0 .01" />
    <Path d="M12 14l0 .01" />
    <Path d="M16 14l0 .01" />
    <Path d="M8 17l0 .01" />
    <Path d="M12 17l0 .01" />
    <Path d="M16 17l0 .01" />
  </Svg>
);
export default SvgCalculator;

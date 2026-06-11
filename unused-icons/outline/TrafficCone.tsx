import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrafficCone = (props: SvgProps) => (
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
    <Path d="M4 20l16 0" />
    <Path d="M9.4 10l5.2 0" />
    <Path d="M7.8 15l8.4 0" />
    <Path d="M6 20l5 -15h2l5 15" />
  </Svg>
);
export default SvgTrafficCone;

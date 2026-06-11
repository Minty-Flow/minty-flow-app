import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMatrix = (props: SvgProps) => (
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
    <Path d="M8 16h.013" />
    <Path d="M12.01 16h.005" />
    <Path d="M16.015 16h.005" />
    <Path d="M16.015 12h.005" />
    <Path d="M8.01 12h.005" />
    <Path d="M12.01 12h.005" />
    <Path d="M16.02 8h.005" />
    <Path d="M8.015 8h.005" />
    <Path d="M12.015 8h.005" />
    <Path d="M7 4h-1a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h1" />
    <Path d="M17 4h1a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-1" />
  </Svg>
);
export default SvgMatrix;

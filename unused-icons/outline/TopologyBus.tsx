import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTopologyBus = (props: SvgProps) => (
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
    <Path d="M14 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M6 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M22 10a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M2 16h20" />
    <Path d="M4 12v4" />
    <Path d="M12 12v4" />
    <Path d="M20 12v4" />
  </Svg>
);
export default SvgTopologyBus;

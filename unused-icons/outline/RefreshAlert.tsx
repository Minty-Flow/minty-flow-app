import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRefreshAlert = (props: SvgProps) => (
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
    <Path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
    <Path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    <Path d="M12 9l0 3" />
    <Path d="M12 15l.01 0" />
  </Svg>
);
export default SvgRefreshAlert;

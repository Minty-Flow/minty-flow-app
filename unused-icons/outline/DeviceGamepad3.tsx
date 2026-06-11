import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceGamepad3 = (props: SvgProps) => (
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
    <Path d="M9 12l-3 -3h-2a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h2l3 -3" />
    <Path d="M15 12l3 -3h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2l-3 -3" />
    <Path d="M12 15l-3 3v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1 -1v-2l-3 -3" />
    <Path d="M12 9l-3 -3v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2l-3 3" />
  </Svg>
);
export default SvgDeviceGamepad3;

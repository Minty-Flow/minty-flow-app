import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBatteryAutomotive = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M18 2a1 1 0 0 1 1 1v1a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3v-1a1 1 0 1 1 2 0v1h10v-1a1 1 0 0 1 1 -1m-2 7.5a1 1 0 0 0 -1 1v.5h-.5a1 1 0 0 0 0 2h.5v.5a1 1 0 0 0 2 0v-.5h.5a1 1 0 0 0 0 -2h-.5v-.5a1 1 0 0 0 -1 -1m-6.5 1.5h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0 -2" />
  </Svg>
);
export default SvgBatteryAutomotive;

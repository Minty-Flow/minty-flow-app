import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockEdit = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 0 -9.972 8.948c.32 .034 .644 .052 .972 .052" />
    <Path d="M12 7v5l2 2" />
    <Path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39" />
  </Svg>
);
export default SvgClockEdit;

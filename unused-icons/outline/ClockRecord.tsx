import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockRecord = (props: SvgProps) => (
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
    <Path d="M21 12.3a9 9 0 1 0 -8.683 8.694" />
    <Path d="M12 7v5l2 2" />
    <Path d="M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgClockRecord;

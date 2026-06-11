import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRoadOff = (props: SvgProps) => (
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
    <Path d="M4 19l3.332 -11.661" />
    <Path d="M16 5l2.806 9.823" />
    <Path d="M12 8v-2" />
    <Path d="M12 13v-1" />
    <Path d="M12 18v-2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRoadOff;

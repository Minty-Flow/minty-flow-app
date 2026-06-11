import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBedOff = (props: SvgProps) => (
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
    <Path d="M7 7a2 2 0 1 0 2 2" />
    <Path d="M22 17v-3h-4m-4 0h-12" />
    <Path d="M2 8v9" />
    <Path d="M12 12v2h2m4 0h4v-2a3 3 0 0 0 -3 -3h-6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBedOff;

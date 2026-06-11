import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgComponentsOff = (props: SvgProps) => (
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
    <Path d="M3 12l3 3l3 -3l-3 -3l-3 3" />
    <Path d="M18.5 14.5l2.5 -2.5l-3 -3l-2.5 2.5" />
    <Path d="M12.499 8.501l2.501 -2.501l-3 -3l-2.5 2.5" />
    <Path d="M9 18l3 3l3 -3l-3 -3l-3 3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgComponentsOff;

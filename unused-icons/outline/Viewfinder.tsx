import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgViewfinder = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M12 3l0 4" />
    <Path d="M12 21l0 -3" />
    <Path d="M3 12l4 0" />
    <Path d="M21 12l-3 0" />
    <Path d="M12 12l0 .01" />
  </Svg>
);
export default SvgViewfinder;

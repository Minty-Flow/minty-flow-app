import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBandage = (props: SvgProps) => (
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
    <Path d="M14 12l0 .01" />
    <Path d="M10 12l0 .01" />
    <Path d="M12 10l0 .01" />
    <Path d="M12 14l0 .01" />
    <Path d="M4.5 12.5l8 -8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1 -7 -7" />
  </Svg>
);
export default SvgBandage;

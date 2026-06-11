import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicroscope = (props: SvgProps) => (
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
    <Path d="M5 21h14" />
    <Path d="M6 18h2" />
    <Path d="M7 18v3" />
    <Path d="M9 11l3 3l6 -6l-3 -3l-6 6" />
    <Path d="M10.5 12.5l-1.5 1.5" />
    <Path d="M17 3l3 3" />
    <Path d="M12 21a6 6 0 0 0 3.715 -10.712" />
  </Svg>
);
export default SvgMicroscope;

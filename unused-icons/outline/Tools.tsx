import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTools = (props: SvgProps) => (
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
    <Path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
    <Path d="M14.5 5.5l4 4" />
    <Path d="M12 8l-5 -5l-4 4l5 5" />
    <Path d="M7 8l-1.5 1.5" />
    <Path d="M16 12l5 5l-4 4l-5 -5" />
    <Path d="M16 17l-1.5 1.5" />
  </Svg>
);
export default SvgTools;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlassGin = (props: SvgProps) => (
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
    <Path d="M8 21h8" />
    <Path d="M12 15v6" />
    <Path d="M5.5 5a6.5 2 0 1 0 13 0a6.5 2 0 1 0 -13 0" />
    <Path d="M5.75 4.5c-.612 .75 -.75 2 -.75 3.5a7 7 0 0 0 14 0c0 -1.5 -.094 -2.75 -.75 -3.5" />
  </Svg>
);
export default SvgGlassGin;

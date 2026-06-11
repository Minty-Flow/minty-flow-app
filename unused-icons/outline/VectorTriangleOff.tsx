import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVectorTriangleOff = (props: SvgProps) => (
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
    <Path d="M10 6v-1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1" />
    <Path d="M3 18a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M20.705 20.709a1 1 0 0 1 -.705 .291h-2a1 1 0 0 1 -1 -1v-2c0 -.28 .115 -.532 .3 -.714" />
    <Path d="M6.5 17.1l3.749 -6.823" />
    <Path d="M13.158 9.197l-.658 -1.197" />
    <Path d="M7 19h10" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgVectorTriangleOff;

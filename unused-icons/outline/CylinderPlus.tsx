import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCylinderPlus = (props: SvgProps) => (
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
    <Path d="M5 6a7 3 0 1 0 14 0a7 3 0 1 0 -14 0" />
    <Path d="M5 6v12c0 1.657 3.134 3 7 3c.173 0 .345 -.003 .515 -.008m6.485 -8.992v-6" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgCylinderPlus;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMesh = (props: SvgProps) => (
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
    <Path d="M3 9h18" />
    <Path d="M3 15h18" />
    <Path d="M8 4c.485 .445 3.5 3.312 3.5 8c0 .663 -.07 4.848 -3.5 8" />
    <Path d="M15 4a17 17 0 0 1 2.004 8c0 1.51 -.201 4.628 -2.004 8" />
    <Path d="M18.778 20h-13.556a2.22 2.22 0 0 1 -2.222 -2.222v-11.556c0 -1.227 .995 -2.222 2.222 -2.222h13.556c1.227 0 2.222 .995 2.222 2.222v11.556a2.22 2.22 0 0 1 -2.222 2.222" />
  </Svg>
);
export default SvgMesh;

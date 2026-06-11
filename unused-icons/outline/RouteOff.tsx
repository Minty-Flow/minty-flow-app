import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRouteOff = (props: SvgProps) => (
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
    <Path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 19h4.5c.71 0 1.372 -.212 1.924 -.576m1.545 -2.459a3.5 3.5 0 0 0 -3.469 -3.965h-.499m-4 0h-3.501a3.5 3.5 0 0 1 -2.477 -5.972m2.477 -1.028h3.5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRouteOff;

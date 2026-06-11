import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGhost2 = (props: SvgProps) => (
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
    <Path d="M10 9h.01" />
    <Path d="M14 9h.01" />
    <Path d="M12 3a7 7 0 0 1 7 7v1l1 0a2 2 0 1 1 0 4l-1 0v3l2 3h-10a6 6 0 0 1 -6 -5.775l0 -.226l-1 0a2 2 0 0 1 0 -4l1 0v-1a7 7 0 0 1 7 -7l0 .001" />
    <Path d="M11 14h2a1 1 0 0 0 -2 0" />
  </Svg>
);
export default SvgGhost2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGeometry = (props: SvgProps) => (
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
    <Path d="M7 21l4 -12m2 0l1.48 4.439m.949 2.847l1.571 4.714" />
    <Path d="M10 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 12c1.526 2.955 4.588 5 8 5c3.41 0 6.473 -2.048 8 -5" />
    <Path d="M12 5v-2" />
  </Svg>
);
export default SvgGeometry;

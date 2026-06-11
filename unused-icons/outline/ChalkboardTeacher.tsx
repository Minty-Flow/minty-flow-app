import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChalkboardTeacher = (props: SvgProps) => (
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
    <Path d="M8 19h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v11a1 1 0 0 1 -1 1" />
    <Path d="M12 14a2 2 0 1 0 4.001 -.001a2 2 0 0 0 -4.001 .001" />
    <Path d="M17 19a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -2 2" />
  </Svg>
);
export default SvgChalkboardTeacher;

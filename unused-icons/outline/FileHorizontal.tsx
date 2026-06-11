import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileHorizontal = (props: SvgProps) => (
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
    <Path d="M16 5v4a1 1 0 0 0 1 1h4" />
    <Path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-7l-5 -5h-11a2 2 0 0 0 -2 2" />
  </Svg>
);
export default SvgFileHorizontal;

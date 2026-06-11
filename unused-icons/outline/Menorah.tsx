import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMenorah = (props: SvgProps) => (
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
    <Path d="M12 4v16" />
    <Path d="M8 4v2a4 4 0 1 0 8 0v-2" />
    <Path d="M4 4v2a8 8 0 1 0 16 0v-2" />
    <Path d="M10 20h4" />
  </Svg>
);
export default SvgMenorah;

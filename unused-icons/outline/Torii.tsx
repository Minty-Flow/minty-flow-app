import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTorii = (props: SvgProps) => (
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
    <Path d="M4 4c5.333 1.333 10.667 1.333 16 0" />
    <Path d="M4 8h16" />
    <Path d="M12 5v3" />
    <Path d="M18 4.5v15.5" />
    <Path d="M6 4.5v15.5" />
  </Svg>
);
export default SvgTorii;

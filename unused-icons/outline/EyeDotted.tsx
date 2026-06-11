import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeDotted = (props: SvgProps) => (
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
    <Path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M21 12h.01" />
    <Path d="M3 12h.01" />
    <Path d="M5 15h.01" />
    <Path d="M5 9h.01" />
    <Path d="M19 15h.01" />
    <Path d="M12 18h.01" />
    <Path d="M12 6h.01" />
    <Path d="M8 17h.01" />
    <Path d="M8 7h.01" />
    <Path d="M16 17h.01" />
    <Path d="M16 7h.01" />
    <Path d="M19 9h.01" />
  </Svg>
);
export default SvgEyeDotted;

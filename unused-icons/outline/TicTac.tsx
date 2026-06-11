import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTicTac = (props: SvgProps) => (
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
    <Path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 12h18" />
    <Path d="M12 3v18" />
    <Path d="M4 16l4 4" />
    <Path d="M4 20l4 -4" />
    <Path d="M16 4l4 4" />
    <Path d="M16 8l4 -4" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgTicTac;

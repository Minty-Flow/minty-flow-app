import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgXboxB = (props: SvgProps) => (
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
    <Path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9" />
    <Path d="M13 12a2 2 0 1 1 0 4h-3v-4" />
    <Path d="M13 12h-3" />
    <Path d="M13 12a2 2 0 1 0 0 -4h-3v4" />
  </Svg>
);
export default SvgXboxB;

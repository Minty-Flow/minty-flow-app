import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOlympics = (props: SvgProps) => (
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
    <Path d="M3 9a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15 9a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9 9a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M6 15a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M12 15a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgOlympics;

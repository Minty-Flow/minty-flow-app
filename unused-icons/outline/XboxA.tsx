import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgXboxA = (props: SvgProps) => (
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
    <Path d="M15 16l-3 -8l-3 8" />
    <Path d="M14 14h-4" />
  </Svg>
);
export default SvgXboxA;

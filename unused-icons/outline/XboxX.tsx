import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgXboxX = (props: SvgProps) => (
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
    <Path d="M9 8l6 8" />
    <Path d="M15 8l-6 8" />
  </Svg>
);
export default SvgXboxX;

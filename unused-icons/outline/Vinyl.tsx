import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVinyl = (props: SvgProps) => (
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
    <Path d="M16 3.937a9 9 0 1 0 5 8.063" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M19 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M20 4l-3.5 10l-2.5 2" />
  </Svg>
);
export default SvgVinyl;

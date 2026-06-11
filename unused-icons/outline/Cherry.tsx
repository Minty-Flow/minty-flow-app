import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCherry = (props: SvgProps) => (
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
    <Path d="M4 16.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
    <Path d="M14 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9 13c.366 -2 1.866 -3.873 4.5 -5.6" />
    <Path d="M17 15c-1.333 -2.333 -2.333 -5.333 -1 -9" />
    <Path d="M5 6c3.667 -2.667 7.333 -2.667 11 0c-3.667 2.667 -7.333 2.667 -11 0" />
  </Svg>
);
export default SvgCherry;

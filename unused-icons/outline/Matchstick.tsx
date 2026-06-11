import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMatchstick = (props: SvgProps) => (
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
    <Path d="M3 21l14 -9" />
    <Path d="M16 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M17 3l3.62 7.29a4.007 4.007 0 0 1 -.764 4.51a4 4 0 0 1 -6.493 -4.464l3.637 -7.336" />
  </Svg>
);
export default SvgMatchstick;

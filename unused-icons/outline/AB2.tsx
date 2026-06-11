import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAB2 = (props: SvgProps) => (
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
    <Path d="M16 21h3c.81 0 1.48 -.67 1.48 -1.48l.02 -.02c0 -.82 -.69 -1.5 -1.5 -1.5h-3v3" />
    <Path d="M16 15h2.5c.84 -.01 1.5 .66 1.5 1.5s-.66 1.5 -1.5 1.5h-2.5v-3" />
    <Path d="M4 9v-4c0 -1.036 .895 -2 2 -2s2 .964 2 2v4" />
    <Path d="M2.99 11.98a9 9 0 0 0 9 9m9 -9a9 9 0 0 0 -9 -9" />
    <Path d="M8 7h-4" />
  </Svg>
);
export default SvgAB2;

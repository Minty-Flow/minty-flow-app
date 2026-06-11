import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilter2Pin = (props: SvgProps) => (
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
    <Path d="M4 6h16" />
    <Path d="M6 12h10" />
    <Path d="M9 18h3" />
    <Path d="M19 18v.01m2.121 2.111c.42 -.419 .706 -.954 .821 -1.536c.116 -.582 .056 -1.185 -.17 -1.733c-.227 -.548 -.611 -1.017 -1.105 -1.347c-.493 -.33 -1.073 -.506 -1.667 -.506c-.593 0 -1.173 .176 -1.667 .506c-.493 .33 -.878 .798 -1.105 1.347c-.227 .548 -.286 1.151 -.17 1.733c.116 .582 .402 1.116 .821 1.536c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879l-2.121 -2.121" />
  </Svg>
);
export default SvgFilter2Pin;

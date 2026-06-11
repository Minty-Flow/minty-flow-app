import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWhisk = (props: SvgProps) => (
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
    <Path d="M21.015 3.035l-16.515 16.465" />
    <Path d="M3.173 17.619a4.63 4.63 0 0 0 3.284 3.26a4.67 4.67 0 0 0 4.487 -1.194c1.85 -1.836 4.07 -10.65 4.07 -10.65s-8.88 2.296 -10.639 4.132a4.59 4.59 0 0 0 -1.202 4.452" />
  </Svg>
);
export default SvgWhisk;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathMin = (props: SvgProps) => (
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
    <Path d="M15 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M3 13s1 -9 4 -9c2.48 0 5.643 9.565 8.36 12.883" />
    <Path d="M18.748 17.038c.702 -.88 1.452 -3.56 2.252 -8.038" />
  </Svg>
);
export default SvgMathMin;

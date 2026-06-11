import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVariable = (props: SvgProps) => (
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
    <Path d="M5 4c-2.5 5 -2.5 10 0 16m14 -16c2.5 5 2.5 10 0 16m-10 -11h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" />
    <Path d="M8 16c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" />
  </Svg>
);
export default SvgVariable;

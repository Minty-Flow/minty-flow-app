import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSquareRoot2 = (props: SvgProps) => (
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
    <Path d="M13 12h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" />
    <Path d="M12 19c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" />
    <Path d="M3 12h1l3 8l3 -16h10" />
  </Svg>
);
export default SvgSquareRoot2;

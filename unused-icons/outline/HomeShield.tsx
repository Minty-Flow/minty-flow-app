import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeShield = (props: SvgProps) => (
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
    <Path d="M5 12h-2l9 -9l7.636 7.636" />
    <Path d="M5 12v7a2 2 0 0 0 2 2h5" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h1.5" />
    <Path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5" />
  </Svg>
);
export default SvgHomeShield;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgApertureOff = (props: SvgProps) => (
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
    <Path d="M3.6 15h10.55" />
    <Path d="M5.641 5.631a9 9 0 1 0 12.719 12.738m1.68 -2.318a9 9 0 0 0 -12.074 -12.098" />
    <Path d="M7.395 7.534l2.416 7.438" />
    <Path d="M17.032 4.636l-4.852 3.526m-2.334 1.695l-1.349 .98" />
    <Path d="M20.559 14.51l-8.535 -6.201" />
    <Path d="M12.257 20.916l2.123 -6.533m.984 -3.028l.154 -.473" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgApertureOff;

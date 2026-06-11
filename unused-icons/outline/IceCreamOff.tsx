import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIceCreamOff = (props: SvgProps) => (
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
    <Path d="M12 21.5v-4.5" />
    <Path d="M8 8v9h8v-1m0 -4v-5a4 4 0 0 0 -7.277 -2.294" />
    <Path d="M8 10.5l1.74 -.76m2.79 -1.222l3.47 -1.518" />
    <Path d="M8 14.5l4.488 -1.964" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgIceCreamOff;

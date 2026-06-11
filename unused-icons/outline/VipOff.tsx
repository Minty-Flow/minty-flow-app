import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVipOff = (props: SvgProps) => (
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
    <Path d="M3 5h2m4 0h12" />
    <Path d="M3 19h16" />
    <Path d="M4 9l2 6h1l2 -6" />
    <Path d="M12 12v3" />
    <Path d="M16 12v-3h2a2 2 0 1 1 0 4h-1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgVipOff;

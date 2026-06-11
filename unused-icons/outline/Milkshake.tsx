import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMilkshake = (props: SvgProps) => (
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
    <Path d="M17 10a5 5 0 0 0 -10 0" />
    <Path d="M6 11a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1l0 -1" />
    <Path d="M7 13l1.81 7.243a1 1 0 0 0 .97 .757h4.44a1 1 0 0 0 .97 -.757l1.81 -7.243" />
    <Path d="M12 5v-2" />
  </Svg>
);
export default SvgMilkshake;

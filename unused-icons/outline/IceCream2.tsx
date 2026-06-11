import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIceCream2 = (props: SvgProps) => (
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
    <Path d="M17.657 11a6 6 0 1 0 -11.315 0" />
    <Path d="M6.342 11l5.658 11l5.657 -11l-11.315 0" />
  </Svg>
);
export default SvgIceCream2;

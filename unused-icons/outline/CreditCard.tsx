import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCreditCard = (props: SvgProps) => (
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
    <Path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" />
    <Path d="M3 10l18 0" />
    <Path d="M7 15l.01 0" />
    <Path d="M11 15l2 0" />
  </Svg>
);
export default SvgCreditCard;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBasketMinus = (props: SvgProps) => (
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
    <Path d="M17 10l-2 -6" />
    <Path d="M7 10l2 -6" />
    <Path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.833 4.75" />
    <Path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgBasketMinus;

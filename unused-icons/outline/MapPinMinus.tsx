import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapPinMinus = (props: SvgProps) => (
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
    <Path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M12.758 21.337a2 2 0 0 1 -2.171 -.437l-4.244 -4.243a8 8 0 1 1 12.585 -1.652" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgMapPinMinus;

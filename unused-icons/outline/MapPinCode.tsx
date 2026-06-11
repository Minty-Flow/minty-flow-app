import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapPinCode = (props: SvgProps) => (
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
    <Path d="M11.85 21.48a1.992 1.992 0 0 1 -1.263 -.58l-4.244 -4.243a8 8 0 1 1 13.385 -3.585" />
    <Path d="M20 21l2 -2l-2 -2" />
    <Path d="M17 17l-2 2l2 2" />
  </Svg>
);
export default SvgMapPinCode;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeDiscount = (props: SvgProps) => (
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
    <Path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M12 18c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    <Path d="M16 21l5 -5" />
    <Path d="M21 21v.01" />
    <Path d="M16 16v.01" />
  </Svg>
);
export default SvgEyeDiscount;

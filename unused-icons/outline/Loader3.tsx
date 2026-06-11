import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLoader3 = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" />
    <Path d="M17 12a5 5 0 1 0 -5 5" />
  </Svg>
);
export default SvgLoader3;

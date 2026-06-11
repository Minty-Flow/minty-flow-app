import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrid3X3 = (props: SvgProps) => (
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
    <Path d="M3 8h18" />
    <Path d="M3 16h18" />
    <Path d="M8 3v18" />
    <Path d="M16 3v18" />
  </Svg>
);
export default SvgGrid3X3;

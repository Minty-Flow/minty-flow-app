import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrid4X4 = (props: SvgProps) => (
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
    <Path d="M3 6h18" />
    <Path d="M3 12h18" />
    <Path d="M3 18h18" />
    <Path d="M6 3v18" />
    <Path d="M12 3v18" />
    <Path d="M18 3v18" />
  </Svg>
);
export default SvgGrid4X4;

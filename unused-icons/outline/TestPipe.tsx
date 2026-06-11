import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTestPipe = (props: SvgProps) => (
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
    <Path d="M20 8.04l-12.122 12.124a2.857 2.857 0 1 1 -4.041 -4.04l12.122 -12.124" />
    <Path d="M7 13h8" />
    <Path d="M19 15l1.5 1.6a2 2 0 1 1 -3 0l1.5 -1.6" />
    <Path d="M15 3l6 6" />
  </Svg>
);
export default SvgTestPipe;

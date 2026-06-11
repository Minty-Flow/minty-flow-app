import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMultiplier2X = (props: SvgProps) => (
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
    <Path d="M14 16l4 -4" />
    <Path d="M18 16l-4 -4" />
    <Path d="M6 10a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0" />
  </Svg>
);
export default SvgMultiplier2X;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMath1Divide2 = (props: SvgProps) => (
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
    <Path d="M5 12h14" />
    <Path d="M10 15h3a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h3" />
    <Path d="M10 5l2 -2v6" />
  </Svg>
);
export default SvgMath1Divide2;

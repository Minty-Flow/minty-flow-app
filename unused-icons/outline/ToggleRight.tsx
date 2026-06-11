import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToggleRight = (props: SvgProps) => (
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
    <Path d="M14 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M2 12a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6" />
  </Svg>
);
export default SvgToggleRight;

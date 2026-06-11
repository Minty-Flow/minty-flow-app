import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandMatrix = (props: SvgProps) => (
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
    <Path d="M4 3h-1v18h1" />
    <Path d="M20 21h1v-18h-1" />
    <Path d="M7 9v6" />
    <Path d="M12 15v-3.5a2.5 2.5 0 1 0 -5 0v.5" />
    <Path d="M17 15v-3.5a2.5 2.5 0 1 0 -5 0v.5" />
  </Svg>
);
export default SvgBrandMatrix;

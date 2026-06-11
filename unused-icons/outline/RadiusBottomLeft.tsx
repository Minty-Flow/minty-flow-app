import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRadiusBottomLeft = (props: SvgProps) => (
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
    <Path d="M19 19h-6a8 8 0 0 1 -8 -8v-6" />
  </Svg>
);
export default SvgRadiusBottomLeft;

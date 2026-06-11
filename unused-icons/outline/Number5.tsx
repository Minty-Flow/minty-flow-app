import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumber5 = (props: SvgProps) => (
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
    <Path d="M8 20h4a4 4 0 1 0 0 -8h-4v-8h8" />
  </Svg>
);
export default SvgNumber5;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCheckbox = (props: SvgProps) => (
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
    <Path d="M9 11l3 3l8 -8" />
    <Path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
  </Svg>
);
export default SvgCheckbox;

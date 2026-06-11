import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSTurnDown = (props: SvgProps) => (
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
    <Path d="M7 5a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M5 7v9.5a3.5 3.5 0 0 0 7 0v-9a3.5 3.5 0 0 1 7 0v13.5" />
    <Path d="M16 18l3 3l3 -3" />
  </Svg>
);
export default SvgSTurnDown;

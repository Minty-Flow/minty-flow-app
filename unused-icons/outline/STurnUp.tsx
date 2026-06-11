import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSTurnUp = (props: SvgProps) => (
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
    <Path d="M7 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M5 17v-9.5a3.5 3.5 0 0 1 7 0v9a3.5 3.5 0 0 0 7 0v-13.5" />
    <Path d="M16 6l3 -3l3 3" />
  </Svg>
);
export default SvgSTurnUp;

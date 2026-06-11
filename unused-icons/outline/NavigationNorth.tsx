import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNavigationNorth = (props: SvgProps) => (
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
    <Path d="M16 21l-4 -8l-4 8l4 -2l4 2" />
    <Path d="M10 9v-6l4 6v-6" />
  </Svg>
);
export default SvgNavigationNorth;

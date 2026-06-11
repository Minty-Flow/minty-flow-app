import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilters = (props: SvgProps) => (
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
    <Path d="M7 8a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M8 11a5 5 0 1 0 3.998 1.997" />
    <Path d="M12.002 19.003a5 5 0 1 0 3.998 -8.003" />
  </Svg>
);
export default SvgFilters;

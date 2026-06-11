import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNorthStar = (props: SvgProps) => (
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
    <Path d="M3 12h18" />
    <Path d="M12 21v-18" />
    <Path d="M7.5 7.5l9 9" />
    <Path d="M7.5 16.5l9 -9" />
  </Svg>
);
export default SvgNorthStar;

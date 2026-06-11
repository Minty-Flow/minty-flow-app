import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgQuotes = (props: SvgProps) => (
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
    <Path d="M4 12c-1.333 -1.854 -1.333 -4.146 0 -6" />
    <Path d="M8 12c-1.333 -1.854 -1.333 -4.146 0 -6" />
    <Path d="M16 18c1.333 -1.854 1.333 -4.146 0 -6" />
    <Path d="M20 18c1.333 -1.854 1.333 -4.146 0 -6" />
  </Svg>
);
export default SvgQuotes;

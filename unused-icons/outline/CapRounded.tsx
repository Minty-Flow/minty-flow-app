import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCapRounded = (props: SvgProps) => (
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
    <Path d="M20 6h-9a6 6 0 1 0 0 12h9" />
    <Path d="M13 12a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M13 12h7" />
  </Svg>
);
export default SvgCapRounded;

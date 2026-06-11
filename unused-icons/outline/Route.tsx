import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRoute = (props: SvgProps) => (
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
    <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
    <Path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
  </Svg>
);
export default SvgRoute;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHours24 = (props: SvgProps) => (
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
    <Path d="M4 13c.325 2.532 1.881 4.781 4 6" />
    <Path d="M20 11a8.1 8.1 0 0 0 -15.5 -2" />
    <Path d="M4 5v4h4" />
    <Path d="M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
    <Path d="M18 15v2a1 1 0 0 0 1 1h1" />
    <Path d="M21 15v6" />
  </Svg>
);
export default SvgHours24;

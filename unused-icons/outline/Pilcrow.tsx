import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPilcrow = (props: SvgProps) => (
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
    <Path d="M13 4v16" />
    <Path d="M17 4v16" />
    <Path d="M19 4h-9.5a4.5 4.5 0 0 0 0 9h3.5" />
  </Svg>
);
export default SvgPilcrow;

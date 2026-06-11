import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSportBillard = (props: SvgProps) => (
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
    <Path d="M10 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
  </Svg>
);
export default SvgSportBillard;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUserSquare = (props: SvgProps) => (
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
    <Path d="M9 10a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M6 21v-1a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v1" />
    <Path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
  </Svg>
);
export default SvgUserSquare;

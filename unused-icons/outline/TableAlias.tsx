import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTableAlias = (props: SvgProps) => (
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
    <Path d="M3 12v-7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-7" />
    <Path d="M3 10h18" />
    <Path d="M10 3v10" />
    <Path d="M2 17a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4" />
  </Svg>
);
export default SvgTableAlias;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCrane = (props: SvgProps) => (
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
    <Path d="M6 21h6" />
    <Path d="M9 21v-18l-6 6h18" />
    <Path d="M9 3l10 6" />
    <Path d="M17 9v4a2 2 0 1 1 -2 2" />
  </Svg>
);
export default SvgCrane;

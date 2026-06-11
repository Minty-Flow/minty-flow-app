import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoxAlignBottom = (props: SvgProps) => (
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
    <Path d="M4 14h16v5a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-5" />
    <Path d="M4 9v.01" />
    <Path d="M4 4v.01" />
    <Path d="M9 4v.01" />
    <Path d="M15 4v.01" />
    <Path d="M20 4v.01" />
    <Path d="M20 9v.01" />
  </Svg>
);
export default SvgBoxAlignBottom;

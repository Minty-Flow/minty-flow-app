import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBlockquote = (props: SvgProps) => (
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
    <Path d="M6 15h15" />
    <Path d="M21 19h-15" />
    <Path d="M15 11h6" />
    <Path d="M21 7h-6" />
    <Path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
    <Path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
  </Svg>
);
export default SvgBlockquote;

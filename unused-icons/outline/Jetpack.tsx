import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgJetpack = (props: SvgProps) => (
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
    <Path d="M10 6a3 3 0 1 0 -6 0v7h6v-7" />
    <Path d="M14 13h6v-7a3 3 0 0 0 -6 0v7" />
    <Path d="M5 16c0 2.333 .667 4 2 5c1.333 -1 2 -2.667 2 -5" />
    <Path d="M15 16c0 2.333 .667 4 2 5c1.333 -1 2 -2.667 2 -5" />
    <Path d="M10 8h4" />
    <Path d="M10 11h4" />
  </Svg>
);
export default SvgJetpack;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAugmentedReality2 = (props: SvgProps) => (
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
    <Path d="M10 21h-2a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v3.5" />
    <Path d="M17 17l-4 -2.5l4 -2.5l4 2.5v4.5l-4 2.5l0 -4.5" />
    <Path d="M13 14.5v4.5l4 2.5" />
    <Path d="M17 17l4 -2.5" />
    <Path d="M11 4h2" />
  </Svg>
);
export default SvgAugmentedReality2;

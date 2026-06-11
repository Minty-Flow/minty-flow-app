import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeSignal = (props: SvgProps) => (
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
    <Path d="M15 22v-2" />
    <Path d="M18 22v-4" />
    <Path d="M21 22v-6" />
    <Path d="M19 12.494v-.494h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h4" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v.5" />
  </Svg>
);
export default SvgHomeSignal;

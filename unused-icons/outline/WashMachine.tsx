import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWashMachine = (props: SvgProps) => (
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
    <Path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M8 6h.01" />
    <Path d="M11 6h.01" />
    <Path d="M14 6h2" />
    <Path d="M8 14c1.333 -.667 2.667 -.667 4 0c1.333 .667 2.667 .667 4 0" />
  </Svg>
);
export default SvgWashMachine;

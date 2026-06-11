import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLuggage = (props: SvgProps) => (
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
    <Path d="M6 8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -10" />
    <Path d="M9 6v-1a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1" />
    <Path d="M6 10h12" />
    <Path d="M6 16h12" />
    <Path d="M9 20v1" />
    <Path d="M15 20v1" />
  </Svg>
);
export default SvgLuggage;

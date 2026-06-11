import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCodeVariablePlus = (props: SvgProps) => (
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
    <Path d="M13 16h-7a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v1" />
    <Path d="M16 18h6" />
    <Path d="M19 15v6" />
  </Svg>
);
export default SvgCodeVariablePlus;

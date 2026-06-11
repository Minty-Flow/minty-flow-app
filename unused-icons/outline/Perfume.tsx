import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPerfume = (props: SvgProps) => (
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
    <Path d="M10 6v3" />
    <Path d="M14 6v3" />
    <Path d="M5 11a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M10 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M9 3h6v3h-6l0 -3" />
  </Svg>
);
export default SvgPerfume;

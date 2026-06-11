import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGitCompare = (props: SvgProps) => (
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
    <Path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M11 6h5a2 2 0 0 1 2 2v8" />
    <Path d="M14 9l-3 -3l3 -3" />
    <Path d="M13 18h-5a2 2 0 0 1 -2 -2v-8" />
    <Path d="M10 15l3 3l-3 3" />
  </Svg>
);
export default SvgGitCompare;

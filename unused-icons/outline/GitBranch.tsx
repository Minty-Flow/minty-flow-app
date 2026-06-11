import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGitBranch = (props: SvgProps) => (
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
    <Path d="M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 8l0 8" />
    <Path d="M9 18h6a2 2 0 0 0 2 -2v-5" />
    <Path d="M14 14l3 -3l3 3" />
  </Svg>
);
export default SvgGitBranch;

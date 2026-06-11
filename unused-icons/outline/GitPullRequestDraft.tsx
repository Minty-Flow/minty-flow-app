import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGitPullRequestDraft = (props: SvgProps) => (
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
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 8v8" />
    <Path d="M18 11h.01" />
    <Path d="M18 6h.01" />
  </Svg>
);
export default SvgGitPullRequestDraft;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGitCherryPick = (props: SvgProps) => (
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
    <Path d="M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M7 3v6" />
    <Path d="M7 15v6" />
    <Path d="M13 7h2.5l1.5 5l-1.5 5h-2.5" />
    <Path d="M17 12h3" />
  </Svg>
);
export default SvgGitCherryPick;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTournament = (props: SvgProps) => (
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
    <Path d="M2 4a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M2 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M2 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 12h3a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-3" />
    <Path d="M6 4h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-2" />
    <Path d="M14 10h4" />
  </Svg>
);
export default SvgTournament;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNotesOff = (props: SvgProps) => (
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
    <Path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
    <Path d="M11 7h4" />
    <Path d="M9 11h2" />
    <Path d="M9 15h4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgNotesOff;

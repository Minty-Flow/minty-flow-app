import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBath = (props: SvgProps) => (
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
    <Path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1" />
    <Path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" />
    <Path d="M4 21l1 -1.5" />
    <Path d="M20 21l-1 -1.5" />
  </Svg>
);
export default SvgBath;

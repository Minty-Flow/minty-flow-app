import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAtom2 = (props: SvgProps) => (
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
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M12 21l0 .01" />
    <Path d="M3 9l0 .01" />
    <Path d="M21 9l0 .01" />
    <Path d="M8 20.1a9 9 0 0 1 -5 -7.1" />
    <Path d="M16 20.1a9 9 0 0 0 5 -7.1" />
    <Path d="M6.2 5a9 9 0 0 1 11.4 0" />
  </Svg>
);
export default SvgAtom2;

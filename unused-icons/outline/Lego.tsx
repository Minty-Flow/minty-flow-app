import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLego = (props: SvgProps) => (
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
    <Path d="M9.5 11l.01 0" />
    <Path d="M14.5 11l.01 0" />
    <Path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
    <Path d="M7 5h1v-2h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3v1h-10v-1a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3" />
  </Svg>
);
export default SvgLego;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlugConnectedX = (props: SvgProps) => (
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
    <Path d="M20 16l-4 4" />
    <Path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
    <Path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
    <Path d="M3 21l2.5 -2.5" />
    <Path d="M18.5 5.5l2.5 -2.5" />
    <Path d="M10 11l-2 2" />
    <Path d="M13 14l-2 2" />
    <Path d="M16 16l4 4" />
  </Svg>
);
export default SvgPlugConnectedX;

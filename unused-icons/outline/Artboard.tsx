import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArtboard = (props: SvgProps) => (
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
    <Path d="M8 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -6" />
    <Path d="M3 8l1 0" />
    <Path d="M3 16l1 0" />
    <Path d="M8 3l0 1" />
    <Path d="M16 3l0 1" />
    <Path d="M20 8l1 0" />
    <Path d="M20 16l1 0" />
    <Path d="M8 20l0 1" />
    <Path d="M16 20l0 1" />
  </Svg>
);
export default SvgArtboard;

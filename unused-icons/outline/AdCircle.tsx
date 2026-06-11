import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAdCircle = (props: SvgProps) => (
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
    <Path d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
    <Path d="M7 15v-4.5a1.5 1.5 0 0 1 3 0v4.5" />
    <Path d="M7 13h3" />
    <Path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
  </Svg>
);
export default SvgAdCircle;

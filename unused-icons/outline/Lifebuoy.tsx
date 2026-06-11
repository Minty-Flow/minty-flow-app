import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLifebuoy = (props: SvgProps) => (
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
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M15 15l3.35 3.35" />
    <Path d="M9 15l-3.35 3.35" />
    <Path d="M5.65 5.65l3.35 3.35" />
    <Path d="M18.35 5.65l-3.35 3.35" />
  </Svg>
);
export default SvgLifebuoy;

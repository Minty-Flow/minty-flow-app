import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPokeball = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M3 12h6" />
    <Path d="M15 12h6" />
  </Svg>
);
export default SvgPokeball;

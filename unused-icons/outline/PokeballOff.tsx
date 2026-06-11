import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPokeballOff = (props: SvgProps) => (
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
    <Path d="M20.04 16.048a9 9 0 0 0 -12.083 -12.09m-2.32 1.678a9 9 0 1 0 12.737 12.719" />
    <Path d="M9.884 9.874a3 3 0 1 0 4.24 4.246m.57 -3.441a3.012 3.012 0 0 0 -1.41 -1.39" />
    <Path d="M3 12h6m7 0h5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPokeballOff;

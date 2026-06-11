import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMilitaryAward = (props: SvgProps) => (
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
    <Path d="M8 13a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M8.5 10.5l-1 -2.5h-5.5l2.48 5.788a2 2 0 0 0 1.84 1.212h2.18" />
    <Path d="M15.5 10.5l1 -2.5h5.5l-2.48 5.788a2 2 0 0 1 -1.84 1.212h-2.18" />
  </Svg>
);
export default SvgMilitaryAward;

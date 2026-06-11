import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrain = (props: SvgProps) => (
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
    <Path d="M21 13c0 -3.87 -3.37 -7 -10 -7h-8" />
    <Path d="M3 15h16a2 2 0 0 0 2 -2" />
    <Path d="M3 6v5h17.5" />
    <Path d="M3 11v4" />
    <Path d="M8 11v-5" />
    <Path d="M13 11v-4.5" />
    <Path d="M3 19h18" />
  </Svg>
);
export default SvgTrain;

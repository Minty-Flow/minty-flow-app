import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGasStation = (props: SvgProps) => (
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
    <Path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
    <Path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
    <Path d="M3 20l12 0" />
    <Path d="M18 7v1a1 1 0 0 0 1 1h1" />
    <Path d="M4 11l10 0" />
  </Svg>
);
export default SvgGasStation;

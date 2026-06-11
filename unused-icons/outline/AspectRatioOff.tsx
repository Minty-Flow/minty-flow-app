import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAspectRatioOff = (props: SvgProps) => (
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
    <Path d="M9 5h10a2 2 0 0 1 2 2v10m-2 2h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2" />
    <Path d="M7 12v-3h2" />
    <Path d="M17 12v1m-2 2h-1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAspectRatioOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrushOff = (props: SvgProps) => (
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
    <Path d="M3 17a4 4 0 1 1 4 4h-4v-4" />
    <Path d="M21 3a16 16 0 0 0 -9.309 4.704m-1.795 2.212a15.993 15.993 0 0 0 -1.696 3.284" />
    <Path d="M21 3a16 16 0 0 1 -4.697 9.302m-2.195 1.786a15.993 15.993 0 0 1 -3.308 1.712" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBrushOff;

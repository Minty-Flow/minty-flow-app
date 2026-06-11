import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMountainOff = (props: SvgProps) => (
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
    <Path d="M18.281 14.26l-4.201 -8.872a2.3 2.3 0 0 0 -4.158 0l-.165 .349m-1.289 2.719l-5.468 11.544h17" />
    <Path d="M7.5 11l2 2.5l2 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMountainOff;

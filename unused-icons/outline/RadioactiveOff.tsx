import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRadioactiveOff = (props: SvgProps) => (
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
    <Path d="M14.118 14.127c-.182 .181 -.39 .341 -.618 .473l3 5.19a9 9 0 0 0 1.856 -1.423m1.68 -2.32a8.993 8.993 0 0 0 .964 -4.047h-5" />
    <Path d="M13.5 9.4l3 -5.19a9 9 0 0 0 -8.536 -.25" />
    <Path d="M10.5 14.6l-3 5.19a9 9 0 0 1 -4.5 -7.79h6a3 3 0 0 0 1.5 2.6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRadioactiveOff;

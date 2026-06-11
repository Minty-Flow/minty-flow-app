import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlagCode = (props: SvgProps) => (
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
    <Path d="M13.41 14.973a4.991 4.991 0 0 1 -1.41 -.973a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v8" />
    <Path d="M5 21v-7" />
    <Path d="M20 21l2 -2l-2 -2" />
    <Path d="M17 17l-2 2l2 2" />
  </Svg>
);
export default SvgFlagCode;

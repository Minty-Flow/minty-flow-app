import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPennant2 = (props: SvgProps) => (
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
    <Path d="M16 21h-4" />
    <Path d="M14 21v-18" />
    <Path d="M14 4l-9 4l9 4" />
  </Svg>
);
export default SvgPennant2;

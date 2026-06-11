import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHome2 = (props: SvgProps) => (
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
    <Path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <Path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <Path d="M10 12h4v4h-4l0 -4" />
  </Svg>
);
export default SvgHome2;

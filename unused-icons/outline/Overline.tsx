import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOverline = (props: SvgProps) => (
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
    <Path d="M7 9v5a5 5 0 0 0 10 0v-5" />
    <Path d="M5 5h14" />
  </Svg>
);
export default SvgOverline;

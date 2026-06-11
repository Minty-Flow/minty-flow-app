import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgItalic = (props: SvgProps) => (
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
    <Path d="M11 5l6 0" />
    <Path d="M7 19l6 0" />
    <Path d="M14 5l-4 14" />
  </Svg>
);
export default SvgItalic;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextWrapColumn = (props: SvgProps) => (
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
    <Path d="M7 9h7a3 3 0 0 1 0 6h-4l2 -2" />
    <Path d="M12 17l-2 -2" />
    <Path d="M3 3v18" />
    <Path d="M21 3v18" />
  </Svg>
);
export default SvgTextWrapColumn;

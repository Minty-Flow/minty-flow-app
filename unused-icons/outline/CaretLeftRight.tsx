import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCaretLeftRight = (props: SvgProps) => (
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
    <Path d="M14 18l6 -6l-6 -6v12" />
    <Path d="M10 18l-6 -6l6 -6v12" />
  </Svg>
);
export default SvgCaretLeftRight;

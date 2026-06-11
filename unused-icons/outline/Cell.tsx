import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCell = (props: SvgProps) => (
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
    <Path d="M8 4l-4 2v5l4 2l4 -2v-5l-4 -2" />
    <Path d="M12 11l4 2l4 -2v-5l-4 -2l-4 2" />
    <Path d="M8 13v5l4 2l4 -2v-5" />
  </Svg>
);
export default SvgCell;

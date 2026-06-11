import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRectangleVertical = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 2h-10a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" />
  </Svg>
);
export default SvgRectangleVertical;

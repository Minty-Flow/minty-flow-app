import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLayoutAlignMiddle = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M13 5a3 3 0 0 1 3 3v3h4a1 1 0 0 1 0 2h-4v3a3 3 0 0 1 -3 3h-2a3 3 0 0 1 -3 -3v-3h-4a1 1 0 0 1 0 -2h4v-3a3 3 0 0 1 3 -3z" />
  </Svg>
);
export default SvgLayoutAlignMiddle;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumns1 = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2z" />
  </Svg>
);
export default SvgColumns1;

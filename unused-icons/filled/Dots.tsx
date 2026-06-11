import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDots = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M7 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
    <Path d="M14 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
    <Path d="M21 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
  </Svg>
);
export default SvgDots;

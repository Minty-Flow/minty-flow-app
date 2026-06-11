import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMenu2 = (props: SvgProps) => (
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
    <Path d="M4 6l16 0" />
    <Path d="M4 12l16 0" />
    <Path d="M4 18l16 0" />
  </Svg>
);
export default SvgMenu2;

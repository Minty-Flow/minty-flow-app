import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNavigationTop = (props: SvgProps) => (
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
    <Path d="M16.54 19.977a.34 .34 0 0 0 .357 -.07a.33 .33 0 0 0 .084 -.35l-4.981 -10.557l-4.982 10.557a.33 .33 0 0 0 .084 .35a.34 .34 0 0 0 .357 .07l4.541 -1.477l4.54 1.477" />
    <Path d="M12 3v2" />
  </Svg>
);
export default SvgNavigationTop;

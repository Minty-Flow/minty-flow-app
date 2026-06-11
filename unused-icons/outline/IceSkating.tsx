import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIceSkating = (props: SvgProps) => (
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
    <Path d="M5.905 5h3.418a1 1 0 0 1 .928 .629l1.143 2.856a3 3 0 0 0 2.207 1.83l4.717 .926a2.084 2.084 0 0 1 1.682 2.045v.714a1 1 0 0 1 -1 1h-13.895a1 1 0 0 1 -1 -1.1l.8 -8a1 1 0 0 1 1 -.9" />
    <Path d="M3 19h17a1 1 0 0 0 1 -1" />
    <Path d="M9 15v4" />
    <Path d="M15 15v4" />
  </Svg>
);
export default SvgIceSkating;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlertCircleOff = (props: SvgProps) => (
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
    <Path d="M5.644 5.629a9 9 0 1 0 12.715 12.741m1.693 -2.349a9 9 0 0 0 -12.087 -12.068" />
    <Path d="M12 7v1" />
    <Path d="M12 16h.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAlertCircleOff;

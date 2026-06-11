import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBluetooth = (props: SvgProps) => (
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
    <Path d="M7 8l10 8l-5 4l0 -16l5 4l-10 8" />
  </Svg>
);
export default SvgBluetooth;

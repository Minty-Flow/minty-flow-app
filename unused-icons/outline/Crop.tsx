import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCrop = (props: SvgProps) => (
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
    <Path d="M8 5v10a1 1 0 0 0 1 1h10" />
    <Path d="M5 8h10a1 1 0 0 1 1 1v10" />
  </Svg>
);
export default SvgCrop;

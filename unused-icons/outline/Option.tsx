import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOption = (props: SvgProps) => (
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
    <Path d="M14 6h5m0 12h-5l-5 -12h-4" />
  </Svg>
);
export default SvgOption;

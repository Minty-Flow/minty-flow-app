import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZoomReset = (props: SvgProps) => (
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
    <Path d="M21 21l-6 -6" />
    <Path d="M3.268 12.043a7.017 7.017 0 0 0 6.634 4.957a7.012 7.012 0 0 0 7.043 -6.131a7 7 0 0 0 -5.314 -7.672a7.021 7.021 0 0 0 -8.241 4.403" />
    <Path d="M3 4v4h4" />
  </Svg>
);
export default SvgZoomReset;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZoomReplace = (props: SvgProps) => (
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
    <Path d="M3.291 8a7 7 0 0 1 5.077 -4.806a7.021 7.021 0 0 1 8.242 4.403" />
    <Path d="M17 4v4h-4" />
    <Path d="M16.705 12a7 7 0 0 1 -5.074 4.798a7.021 7.021 0 0 1 -8.241 -4.403" />
    <Path d="M3 16v-4h4" />
  </Svg>
);
export default SvgZoomReplace;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBinoculars = (props: SvgProps) => (
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
    <Path d="M4 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M16.346 9.17l-.729 -1.261c-.16 -.248 -1.056 -.203 -1.117 .091l-.177 1.38" />
    <Path d="M19.761 14.813l-2.84 -5.133c-.189 -.31 -.592 -.68 -1.421 -.68c-.828 0 -1.5 .448 -1.5 1v6" />
    <Path d="M7.654 9.17l.729 -1.261c.16 -.249 1.056 -.203 1.117 .091l.177 1.38" />
    <Path d="M4.239 14.813l2.84 -5.133c.189 -.31 .592 -.68 1.421 -.68c.828 0 1.5 .448 1.5 1v6" />
    <Path d="M10 12h4v2h-4l0 -2" />
  </Svg>
);
export default SvgBinoculars;

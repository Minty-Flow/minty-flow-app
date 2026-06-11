import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExposureOff = (props: SvgProps) => (
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
    <Path d="M3.6 20.4l8.371 -8.371m2.04 -2.04l6.389 -6.389" />
    <Path d="M6 8h2m0 0v2" />
    <Path d="M14 16h2" />
    <Path d="M7 3h12a2 2 0 0 1 2 2v12m-.5 3.5c-.362 .36 -.95 .5 -1.5 .5h-14a2 2 0 0 1 -2 -2v-14c0 -.541 .215 -1.033 .565 -1.393" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgExposureOff;

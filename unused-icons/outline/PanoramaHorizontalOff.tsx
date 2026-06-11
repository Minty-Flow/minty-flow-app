import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPanoramaHorizontalOff = (props: SvgProps) => (
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
    <Path d="M10.95 6.952c2.901 .15 5.803 -.323 8.705 -1.42a1 1 0 0 1 1.345 .934v10.534m-3.212 .806c-4.483 -1.281 -8.966 -1.074 -13.449 .622a.993 .993 0 0 1 -1.339 -.935v-11.027a1 1 0 0 1 1.338 -.935c.588 .221 1.176 .418 1.764 .59" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPanoramaHorizontalOff;

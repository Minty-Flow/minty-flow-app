import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoOff = (props: SvgProps) => (
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
    <Path d="M15 8h.01" />
    <Path d="M7 3h11a3 3 0 0 1 3 3v11m-.856 3.099a2.991 2.991 0 0 1 -2.144 .901h-12a3 3 0 0 1 -3 -3v-12c0 -.845 .349 -1.608 .91 -2.153" />
    <Path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
    <Path d="M16.33 12.338c.574 -.054 1.155 .166 1.67 .662l3 3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPhotoOff;

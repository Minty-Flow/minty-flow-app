import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDropletUp = (props: SvgProps) => (
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
    <Path d="M18.6 11.998a6.66 6.66 0 0 0 -.536 -1.12l-4.89 -7.26c-.42 -.626 -1.287 -.804 -1.936 -.398a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546a7.16 7.16 0 0 0 5.002 1.562" />
    <Path d="M19 22v-6" />
    <Path d="M22 19l-3 -3l-3 3" />
  </Svg>
);
export default SvgDropletUp;

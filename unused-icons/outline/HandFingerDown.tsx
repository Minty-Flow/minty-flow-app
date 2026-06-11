import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHandFingerDown = (props: SvgProps) => (
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
    <Path d="M8 12v8.5a1.5 1.5 0 0 0 3 0v-7.5" />
    <Path d="M11 13.5v2a1.5 1.5 0 0 0 3 0v-2.5" />
    <Path d="M14 14.5a1.5 1.5 0 0 0 3 0v-1.5" />
    <Path d="M17 13.5a1.5 1.5 0 0 0 3 0v-4.5a6 6 0 0 0 -6 -6h-2h.208a6 6 0 0 0 -5.012 2.7l-.196 .3q -.468 .718 -3.286 5.728a1.5 1.5 0 0 0 .536 2.022c.734 .44 1.674 .325 2.28 -.28l1.47 -1.47" />
  </Svg>
);
export default SvgHandFingerDown;

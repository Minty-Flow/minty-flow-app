import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPentagram = (props: SvgProps) => (
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
    <Path d="M5.636 5.636a9 9 0 1 1 12.728 12.728a9 9 0 0 1 -12.728 -12.728" />
    <Path d="M15.236 11l5.264 4h-6.5l-2 6l-2 -6h-6.5l5.276 -4l-2.056 -6.28l5.28 3.78l5.28 -3.78l-2.044 6.28" />
  </Svg>
);
export default SvgPentagram;

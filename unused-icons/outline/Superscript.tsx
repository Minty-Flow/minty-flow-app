import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSuperscript = (props: SvgProps) => (
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
    <Path d="M5 7l8 10m-8 0l8 -10" />
    <Path d="M21 11h-4l3.5 -4a1.73 1.73 0 0 0 -3.5 -2" />
  </Svg>
);
export default SvgSuperscript;

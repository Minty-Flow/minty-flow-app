import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStereoGlasses = (props: SvgProps) => (
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
    <Path d="M8 3h-2l-3 9" />
    <Path d="M16 3h2l3 9" />
    <Path d="M3 12v7a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707 -.293l2 -2a1 1 0 0 1 1.414 0l2 2a1 1 0 0 0 .707 .293h4.586a1 1 0 0 0 1 -1v-7h-18" />
    <Path d="M7 16h1" />
    <Path d="M16 16h1" />
  </Svg>
);
export default SvgStereoGlasses;

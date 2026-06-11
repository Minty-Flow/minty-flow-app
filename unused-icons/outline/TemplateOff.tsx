import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemplateOff = (props: SvgProps) => (
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
    <Path d="M8 4h11a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-7m-4 0h-3a1 1 0 0 1 -1 -1v-2c0 -.271 .108 -.517 .283 -.697" />
    <Path d="M4 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6" />
    <Path d="M16 12h4" />
    <Path d="M14 16h2" />
    <Path d="M14 20h6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTemplateOff;

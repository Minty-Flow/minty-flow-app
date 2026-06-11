import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExternalLinkOff = (props: SvgProps) => (
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
    <Path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <Path d="M10 14l2 -2m2.007 -2.007l6 -6" />
    <Path d="M15 4h5v5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgExternalLinkOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHdr = (props: SvgProps) => (
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
    <Path d="M3 16v-8" />
    <Path d="M7 8v8" />
    <Path d="M3 12h4" />
    <Path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2" />
    <Path d="M17 12h2a2 2 0 1 0 0 -4h-2v8m4 0l-3 -4" />
  </Svg>
);
export default SvgHdr;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBackpackOff = (props: SvgProps) => (
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
    <Path d="M10 6h3a6 6 0 0 1 6 6v3m-.129 3.872a3 3 0 0 1 -2.871 2.128h-8a3 3 0 0 1 -3 -3v-6a5.99 5.99 0 0 1 2.285 -4.712" />
    <Path d="M10 6v-1a2 2 0 1 1 4 0v1" />
    <Path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBackpackOff;

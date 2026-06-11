import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWashDry2 = (props: SvgProps) => (
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
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12" />
    <Path d="M6 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <Path d="M10 12h.01" />
    <Path d="M14 12h.01" />
  </Svg>
);
export default SvgWashDry2;

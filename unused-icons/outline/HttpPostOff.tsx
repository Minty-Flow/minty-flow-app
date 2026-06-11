import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpPostOff = (props: SvgProps) => (
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
    <Path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" />
    <Path d="M12 8a2 2 0 0 1 2 2m0 4a2 2 0 1 1 -4 0v-4" />
    <Path d="M20 16a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpPostOff;

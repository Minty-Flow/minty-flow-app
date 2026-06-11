import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgABOff = (props: SvgProps) => (
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
    <Path d="M3 16v-5.5a2.5 2.5 0 0 1 5 0v5.5m0 -4h-5" />
    <Path d="M12 12v6" />
    <Path d="M12 6v2" />
    <Path d="M16 8h3a2 2 0 1 1 0 4h-3m3 0a2 2 0 0 1 .83 3.82m-3.83 -3.82v-4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgABOff;

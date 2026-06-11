import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFireHydrant = (props: SvgProps) => (
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
    <Path d="M5 21h14" />
    <Path d="M17 21v-5h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1v-4a5 5 0 0 0 -10 0v4h-1a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h1v5" />
    <Path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 8h12" />
  </Svg>
);
export default SvgFireHydrant;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumns3 = (props: SvgProps) => (
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
    <Path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-16" />
    <Path d="M9 3v18" />
    <Path d="M15 3v18" />
  </Svg>
);
export default SvgColumns3;

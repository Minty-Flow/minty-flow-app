import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgForklift = (props: SvgProps) => (
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
    <Path d="M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 17l5 0" />
    <Path d="M3 17v-6h13v6" />
    <Path d="M5 11v-4h4" />
    <Path d="M9 11v-6h4l3 6" />
    <Path d="M22 15h-3v-10" />
    <Path d="M16 13l3 0" />
  </Svg>
);
export default SvgForklift;

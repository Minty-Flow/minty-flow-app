import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRazorElectric = (props: SvgProps) => (
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
    <Path d="M8 3v2" />
    <Path d="M12 3v2" />
    <Path d="M16 3v2" />
    <Path d="M9 12v6a3 3 0 0 0 6 0v-6h-6" />
    <Path d="M8 5h8l-1 4h-6l-1 -4" />
    <Path d="M12 17v1" />
  </Svg>
);
export default SvgRazorElectric;

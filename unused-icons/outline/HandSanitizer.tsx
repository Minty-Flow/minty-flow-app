import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHandSanitizer = (props: SvgProps) => (
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
    <Path d="M7 21h10v-10a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v10" />
    <Path d="M15 3h-6a2 2 0 0 0 -2 2" />
    <Path d="M12 3v5" />
    <Path d="M12 11v4" />
    <Path d="M10 13h4" />
  </Svg>
);
export default SvgHandSanitizer;

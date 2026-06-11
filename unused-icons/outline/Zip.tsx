import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZip = (props: SvgProps) => (
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
    <Path d="M16 16v-8h2a2 2 0 1 1 0 4h-2" />
    <Path d="M12 8v8" />
    <Path d="M4 8h4l-4 8h4" />
  </Svg>
);
export default SvgZip;

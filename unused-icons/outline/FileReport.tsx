import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileReport = (props: SvgProps) => (
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
    <Path d="M13 17a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M17 13v4h4" />
    <Path d="M12 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M11.5 21h-6.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v2m0 3v4" />
  </Svg>
);
export default SvgFileReport;

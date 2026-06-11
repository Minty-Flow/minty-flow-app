import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReport = (props: SvgProps) => (
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
    <Path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
    <Path d="M18 14v4h4" />
    <Path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
    <Path d="M8 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <Path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M8 11h4" />
    <Path d="M8 15h3" />
  </Svg>
);
export default SvgReport;

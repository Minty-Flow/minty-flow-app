import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReportSearch = (props: SvgProps) => (
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
    <Path d="M18 12v-5a2 2 0 0 0 -2 -2h-2" />
    <Path d="M8 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <Path d="M8 11h4" />
    <Path d="M8 15h3" />
    <Path d="M14 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
    <Path d="M18.5 19.5l2.5 2.5" />
  </Svg>
);
export default SvgReportSearch;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSatellite = (props: SvgProps) => (
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
    <Path d="M3.707 6.293l2.586 -2.586a1 1 0 0 1 1.414 0l5.586 5.586a1 1 0 0 1 0 1.414l-2.586 2.586a1 1 0 0 1 -1.414 0l-5.586 -5.586a1 1 0 0 1 0 -1.414" />
    <Path d="M6 10l-3 3l3 3l3 -3" />
    <Path d="M10 6l3 -3l3 3l-3 3" />
    <Path d="M12 12l1.5 1.5" />
    <Path d="M14.5 17a2.5 2.5 0 0 0 2.5 -2.5" />
    <Path d="M15 21a6 6 0 0 0 6 -6" />
  </Svg>
);
export default SvgSatellite;

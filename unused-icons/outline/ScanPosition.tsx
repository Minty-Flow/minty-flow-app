import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScanPosition = (props: SvgProps) => (
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
    <Path d="M4 7v-1a2 2 0 0 1 2 -2h2" />
    <Path d="M4 17v1a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v1" />
    <Path d="M16 20h2a2 2 0 0 0 2 -2v-1" />
    <Path d="M12 17l3 -8l-8 3l3.5 1.5l1.5 3.5" />
  </Svg>
);
export default SvgScanPosition;

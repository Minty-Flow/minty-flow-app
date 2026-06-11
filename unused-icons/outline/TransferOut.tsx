import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransferOut = (props: SvgProps) => (
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
    <Path d="M4 19v2h16v-14l-8 -4l-8 4v2" />
    <Path d="M13 14h-9" />
    <Path d="M7 11l-3 3l3 3" />
  </Svg>
);
export default SvgTransferOut;

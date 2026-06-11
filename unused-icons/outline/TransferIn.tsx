import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransferIn = (props: SvgProps) => (
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
    <Path d="M4 18v3h16v-14l-8 -4l-8 4v3" />
    <Path d="M4 14h9" />
    <Path d="M10 11l3 3l-3 3" />
  </Svg>
);
export default SvgTransferIn;

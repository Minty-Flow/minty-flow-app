import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDownloadOff = (props: SvgProps) => (
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
    <Path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 1.83 -1.19" />
    <Path d="M7 11l5 5l2 -2m2 -2l1 -1" />
    <Path d="M12 4v4m0 4v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDownloadOff;

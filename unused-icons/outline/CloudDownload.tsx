import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCloudDownload = (props: SvgProps) => (
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
    <Path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />
    <Path d="M12 13l0 9" />
    <Path d="M9 19l3 3l3 -3" />
  </Svg>
);
export default SvgCloudDownload;

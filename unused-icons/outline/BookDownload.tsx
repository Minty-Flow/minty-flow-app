import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBookDownload = (props: SvgProps) => (
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
    <Path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v5" />
    <Path d="M13 16h-7a2 2 0 0 0 -2 2" />
    <Path d="M15 19l3 3l3 -3" />
    <Path d="M18 22v-9" />
  </Svg>
);
export default SvgBookDownload;

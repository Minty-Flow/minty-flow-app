import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUpload = (props: SvgProps) => (
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
    <Path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
    <Path d="M7 9l5 -5l5 5" />
    <Path d="M12 4l0 12" />
  </Svg>
);
export default SvgUpload;

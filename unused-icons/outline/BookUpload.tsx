import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBookUpload = (props: SvgProps) => (
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
    <Path d="M14 20h-8a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v5" />
    <Path d="M11 16h-5a2 2 0 0 0 -2 2" />
    <Path d="M15 16l3 -3l3 3" />
    <Path d="M18 13v9" />
  </Svg>
);
export default SvgBookUpload;

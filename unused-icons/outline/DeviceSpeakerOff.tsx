import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceSpeakerOff = (props: SvgProps) => (
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
    <Path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
    <Path d="M11.114 11.133a3 3 0 1 0 3.754 3.751" />
    <Path d="M12 7v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceSpeakerOff;

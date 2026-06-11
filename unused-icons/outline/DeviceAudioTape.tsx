import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceAudioTape = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <Path d="M3 17l4 -3h10l4 3" />
    <Path d="M7 9.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M16 9.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
  </Svg>
);
export default SvgDeviceAudioTape;

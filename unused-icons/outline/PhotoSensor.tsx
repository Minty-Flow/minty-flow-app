import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoSensor = (props: SvgProps) => (
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
    <Path d="M17 5h2a2 2 0 0 1 2 2v2" />
    <Path d="M21 15v2a2 2 0 0 1 -2 2h-2" />
    <Path d="M7 19h-2a2 2 0 0 1 -2 -2v-2" />
    <Path d="M3 9v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M7 10a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1l0 -4" />
  </Svg>
);
export default SvgPhotoSensor;

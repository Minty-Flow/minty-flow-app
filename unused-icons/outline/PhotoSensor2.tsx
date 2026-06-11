import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhotoSensor2 = (props: SvgProps) => (
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
    <Path d="M17 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-2" />
    <Path d="M7 19h-2a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  </Svg>
);
export default SvgPhotoSensor2;

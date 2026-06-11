import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceProjector = (props: SvgProps) => (
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
    <Path d="M8 9a5 5 0 1 0 10 0a5 5 0 0 0 -10 0" />
    <Path d="M9 6h-4a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-2" />
    <Path d="M6 15h1" />
    <Path d="M7 18l-1 2" />
    <Path d="M18 18l1 2" />
  </Svg>
);
export default SvgDeviceProjector;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFirstAidKit = (props: SvgProps) => (
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
    <Path d="M8 8v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
    <Path d="M4 10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M10 14h4" />
    <Path d="M12 12v4" />
  </Svg>
);
export default SvgFirstAidKit;

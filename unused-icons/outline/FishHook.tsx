import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFishHook = (props: SvgProps) => (
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
    <Path d="M16 9v6a5 5 0 0 1 -10 0v-4l3 3" />
    <Path d="M14 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 5v-2" />
  </Svg>
);
export default SvgFishHook;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSlideshow = (props: SvgProps) => (
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
    <Path d="M15 6l.01 0" />
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" />
    <Path d="M3 13l4 -4a3 5 0 0 1 3 0l4 4" />
    <Path d="M13 12l2 -2a3 5 0 0 1 3 0l3 3" />
    <Path d="M8 21l.01 0" />
    <Path d="M12 21l.01 0" />
    <Path d="M16 21l.01 0" />
  </Svg>
);
export default SvgSlideshow;

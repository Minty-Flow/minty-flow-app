import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimelineEvent = (props: SvgProps) => (
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
    <Path d="M10 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 20h-6" />
    <Path d="M14 20h6" />
    <Path d="M12 15l-2 -2h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-3l-2 2" />
  </Svg>
);
export default SvgTimelineEvent;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShareplay = (props: SvgProps) => (
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
    <Path d="M18 18a3 3 0 0 0 3 -3v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8a3 3 0 0 0 3 3" />
    <Path d="M9 20h6l-3 -5l-3 5" />
  </Svg>
);
export default SvgShareplay;

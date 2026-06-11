import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgQueuePopIn = (props: SvgProps) => (
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
    <Path d="M8 6h-3a2 2 0 0 0 -2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2 -2v-3.357" />
    <Path d="M13 5a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4" />
    <Path d="M13.5 10.5l-5.5 5.5" />
    <Path d="M8 11v5h5" />
  </Svg>
);
export default SvgQueuePopIn;

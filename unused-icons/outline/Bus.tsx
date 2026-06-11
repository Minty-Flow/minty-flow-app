import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBus = (props: SvgProps) => (
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
    <Path d="M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
    <Path d="M16 5l1.5 7l4.5 0" />
    <Path d="M2 10l15 0" />
    <Path d="M7 5l0 5" />
    <Path d="M12 5l0 5" />
  </Svg>
);
export default SvgBus;

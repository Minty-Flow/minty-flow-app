import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFireExtinguisher = (props: SvgProps) => (
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
    <Path d="M12 7a4 4 0 0 1 4 4v9a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-9a4 4 0 0 1 4 -4" />
    <Path d="M9 16h6" />
    <Path d="M12 7v-3" />
    <Path d="M16 5l-4 -1l4 -1" />
    <Path d="M12 4h-3a3 3 0 0 0 -3 3" />
  </Svg>
);
export default SvgFireExtinguisher;

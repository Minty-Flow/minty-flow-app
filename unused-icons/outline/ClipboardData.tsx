import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClipboardData = (props: SvgProps) => (
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
    <Path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <Path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
    <Path d="M9 17v-4" />
    <Path d="M12 17v-1" />
    <Path d="M15 17v-2" />
    <Path d="M12 17v-1" />
  </Svg>
);
export default SvgClipboardData;

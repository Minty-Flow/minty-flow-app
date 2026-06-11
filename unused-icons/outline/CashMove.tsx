import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCashMove = (props: SvgProps) => (
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
    <Path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" />
    <Path d="M12 19h-4a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v2.5" />
    <Path d="M15.92 13.437a2 2 0 1 0 -2.472 2.486" />
    <Path d="M16 19h6" />
    <Path d="M19 16l3 3l-3 3" />
  </Svg>
);
export default SvgCashMove;

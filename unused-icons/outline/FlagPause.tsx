import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlagPause = (props: SvgProps) => (
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
    <Path d="M13.536 15.029a4.987 4.987 0 0 1 -1.536 -1.029a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v8.5" />
    <Path d="M5 21v-7" />
    <Path d="M17 17v5" />
    <Path d="M21 17v5" />
  </Svg>
);
export default SvgFlagPause;

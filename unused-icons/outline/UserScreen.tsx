import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUserScreen = (props: SvgProps) => (
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
    <Path d="M19.03 17.818a3 3 0 0 0 1.97 -2.818v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8c0 1.317 .85 2.436 2.03 2.84" />
    <Path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M8 21a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2" />
  </Svg>
);
export default SvgUserScreen;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPokerChip = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M12 3v4" />
    <Path d="M12 17v4" />
    <Path d="M3 12h4" />
    <Path d="M17 12h4" />
    <Path d="M18.364 5.636l-2.828 2.828" />
    <Path d="M8.464 15.536l-2.828 2.828" />
    <Path d="M5.636 5.636l2.828 2.828" />
    <Path d="M15.536 15.536l2.828 2.828" />
  </Svg>
);
export default SvgPokerChip;

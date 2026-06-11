import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLanguageKatakana = (props: SvgProps) => (
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
    <Path d="M5 5h6.586a1 1 0 0 1 .707 1.707l-1.293 1.293" />
    <Path d="M8 8c0 1.5 .5 3 -2 5" />
    <Path d="M12 20l4 -9l4 9" />
    <Path d="M19.1 18h-6.2" />
  </Svg>
);
export default SvgLanguageKatakana;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLanguageHiragana = (props: SvgProps) => (
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
    <Path d="M4 5h7" />
    <Path d="M7 4c0 4.846 0 7 .5 8" />
    <Path d="M10 8.5c0 2.286 -2 4.5 -3.5 4.5s-2.5 -1.135 -2.5 -2c0 -2 1 -3 3 -3s5 .57 5 2.857c0 1.524 -.667 2.571 -2 3.143" />
    <Path d="M12 20l4 -9l4 9" />
    <Path d="M19.1 18h-6.2" />
  </Svg>
);
export default SvgLanguageHiragana;

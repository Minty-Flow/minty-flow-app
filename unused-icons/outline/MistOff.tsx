import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMistOff = (props: SvgProps) => (
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
    <Path d="M12 5h9" />
    <Path d="M3 10h7" />
    <Path d="M18 10h1" />
    <Path d="M5 15h5" />
    <Path d="M14 15h1m4 0h2" />
    <Path d="M3 20h9m4 0h3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMistOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMessage2Plus = (props: SvgProps) => (
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
    <Path d="M8 9h8" />
    <Path d="M8 13h6" />
    <Path d="M12.5 20.5l-.5 .5l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgMessage2Plus;

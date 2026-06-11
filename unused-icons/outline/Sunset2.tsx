import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSunset2 = (props: SvgProps) => (
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
    <Path d="M3 13h1" />
    <Path d="M20 13h1" />
    <Path d="M5.6 6.6l.7 .7" />
    <Path d="M18.4 6.6l-.7 .7" />
    <Path d="M8 13a4 4 0 1 1 8 0" />
    <Path d="M3 17h18" />
    <Path d="M7 20h5" />
    <Path d="M16 20h1" />
    <Path d="M12 5v-1" />
  </Svg>
);
export default SvgSunset2;

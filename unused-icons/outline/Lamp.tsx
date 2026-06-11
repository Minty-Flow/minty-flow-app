import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLamp = (props: SvgProps) => (
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
    <Path d="M9 20h6" />
    <Path d="M12 20v-8" />
    <Path d="M5 12h14l-4 -8h-6l-4 8" />
  </Svg>
);
export default SvgLamp;

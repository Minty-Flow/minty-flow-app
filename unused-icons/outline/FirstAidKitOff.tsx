import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFirstAidKitOff = (props: SvgProps) => (
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
    <Path d="M8.595 4.577a2 2 0 0 1 1.405 -.577h4a2 2 0 0 1 2 2v2" />
    <Path d="M12 8h6a2 2 0 0 1 2 2v6m-.576 3.405a2 2 0 0 1 -1.424 .595h-12a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h2" />
    <Path d="M10 14h4" />
    <Path d="M12 12v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFirstAidKitOff;

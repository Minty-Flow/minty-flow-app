import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSnowman = (props: SvgProps) => (
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
    <Path d="M12 3a4 4 0 0 1 2.906 6.75a6 6 0 1 1 -5.81 0a4 4 0 0 1 2.904 -6.75" />
    <Path d="M17.5 11.5l2.5 -1.5" />
    <Path d="M6.5 11.5l-2.5 -1.5" />
    <Path d="M12 13h.01" />
    <Path d="M12 16h.01" />
  </Svg>
);
export default SvgSnowman;

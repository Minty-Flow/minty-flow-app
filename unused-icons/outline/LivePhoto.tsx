import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLivePhoto = (props: SvgProps) => (
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
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M15.9 20.11l0 .01" />
    <Path d="M19.04 17.61l0 .01" />
    <Path d="M20.77 14l0 .01" />
    <Path d="M20.77 10l0 .01" />
    <Path d="M19.04 6.39l0 .01" />
    <Path d="M15.9 3.89l0 .01" />
    <Path d="M12 3l0 .01" />
    <Path d="M8.1 3.89l0 .01" />
    <Path d="M4.96 6.39l0 .01" />
    <Path d="M3.23 10l0 .01" />
    <Path d="M3.23 14l0 .01" />
    <Path d="M4.96 17.61l0 .01" />
    <Path d="M8.1 20.11l0 .01" />
    <Path d="M12 21l0 .01" />
  </Svg>
);
export default SvgLivePhoto;

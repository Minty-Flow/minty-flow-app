import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgServerCog = (props: SvgProps) => (
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
    <Path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
    <Path d="M12 20h-6a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h10.5" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M18 14.5v1.5" />
    <Path d="M18 20v1.5" />
    <Path d="M21.032 16.25l-1.299 .75" />
    <Path d="M16.27 19l-1.3 .75" />
    <Path d="M14.97 16.25l1.3 .75" />
    <Path d="M19.733 19l1.3 .75" />
    <Path d="M7 8v.01" />
    <Path d="M7 16v.01" />
  </Svg>
);
export default SvgServerCog;

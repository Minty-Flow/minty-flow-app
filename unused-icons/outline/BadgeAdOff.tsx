import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBadgeAdOff = (props: SvgProps) => (
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
    <Path d="M9 5h10a2 2 0 0 1 2 2v10m-2 2h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2" />
    <Path d="M14 14v1h1m2 -2v-2a2 2 0 0 0 -2 -2h-1v1" />
    <Path d="M7 15v-4.5a1.5 1.5 0 0 1 2.077 -1.385m.788 .762c.087 .19 .135 .4 .135 .623v4.5" />
    <Path d="M7 13h3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBadgeAdOff;

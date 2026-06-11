import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgServerBolt = (props: SvgProps) => (
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
    <Path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
    <Path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12" />
    <Path d="M7 8v.01" />
    <Path d="M7 16v.01" />
    <Path d="M20 15l-2 3h3l-2 3" />
  </Svg>
);
export default SvgServerBolt;

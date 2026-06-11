import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToolsKitchenOff = (props: SvgProps) => (
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
    <Path d="M7 3h5l-.5 4.5m-.4 3.595l-.1 .905h-6l-.875 -7.874" />
    <Path d="M7 18h2v3h-2v-3" />
    <Path d="M15.225 11.216c.42 -2.518 1.589 -5.177 4.775 -8.216v12h-1" />
    <Path d="M20 15v1m0 4v1h-1v-2" />
    <Path d="M8 12v6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgToolsKitchenOff;

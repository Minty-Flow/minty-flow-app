import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIroningSteamOff = (props: SvgProps) => (
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
    <Path d="M9 4h7.459a3 3 0 0 1 2.959 2.507l.577 3.464l.81 4.865a1 1 0 0 1 -.821 1.15" />
    <Path d="M16 16h-13a7 7 0 0 1 6.056 -6.937" />
    <Path d="M13 9h6.8" />
    <Path d="M12 19v2" />
    <Path d="M8 19l-1 2" />
    <Path d="M16 19l1 2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgIroningSteamOff;

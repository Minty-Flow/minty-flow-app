import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgParachute = (props: SvgProps) => (
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
    <Path d="M22 12a10 10 0 1 0 -20 0" />
    <Path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
    <Path d="M2 12l10 10l-3.5 -10" />
    <Path d="M15.5 12l-3.5 10l10 -10" />
  </Svg>
);
export default SvgParachute;

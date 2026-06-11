import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitDiodeZener = (props: SvgProps) => (
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
    <Path d="M22 12h-6" />
    <Path d="M2 12h6" />
    <Path d="M8 7l8 5l-8 5l0 -10" />
    <Path d="M14 7h2v10h2" />
  </Svg>
);
export default SvgCircuitDiodeZener;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRiyal = (props: SvgProps) => (
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
    <Path d="M15 9v2a2 2 0 1 1 -4 0v-1v1a2 2 0 1 1 -4 0v-1v4a2 2 0 1 1 -4 0v-2" />
    <Path d="M18 12.01v-.01" />
    <Path d="M22 10v1a5 5 0 0 1 -5 5" />
  </Svg>
);
export default SvgCurrencyRiyal;

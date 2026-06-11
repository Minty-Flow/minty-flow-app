import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTooltip = (props: SvgProps) => (
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
    <Path d="M10 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 13l-1.707 -1.707a1 1 0 0 0 -.707 -.293h-2.586a2 2 0 0 1 -2 -2v-3a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2.586a1 1 0 0 0 -.707 .293l-1.707 1.707" />
  </Svg>
);
export default SvgTooltip;

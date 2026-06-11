import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHighlight = (props: SvgProps) => (
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
    <Path d="M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <Path d="M12.5 5.5l4 4" />
    <Path d="M4.5 13.5l4 4" />
    <Path d="M21 15v4h-8l4 -4l4 0" />
  </Svg>
);
export default SvgHighlight;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandWikipedia = (props: SvgProps) => (
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
    <Path d="M3 4.984h2" />
    <Path d="M8 4.984h2.5" />
    <Path d="M14.5 4.984h2.5" />
    <Path d="M22 4.984h-2" />
    <Path d="M4 4.984l5.455 14.516l6.545 -14.516" />
    <Path d="M9 4.984l6 14.516l6 -14.516" />
  </Svg>
);
export default SvgBrandWikipedia;

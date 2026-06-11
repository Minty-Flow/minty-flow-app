import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScriptPlus = (props: SvgProps) => (
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
    <Path d="M17 19h4" />
    <Path d="M14 20h-8a3 3 0 0 1 0 -6h11a3 3 0 0 0 -3 3m7 -3v-8a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8" />
    <Path d="M19 17v4" />
  </Svg>
);
export default SvgScriptPlus;

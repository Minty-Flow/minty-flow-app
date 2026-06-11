import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWashDryP = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M10 16v-8h2.5a2.5 2.5 0 1 1 0 5h-2.5" />
  </Svg>
);
export default SvgWashDryP;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandEtsy = (props: SvgProps) => (
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
    <Path d="M14 12h-5" />
    <Path d="M3 8a5 5 0 0 1 5 -5h8a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-8a5 5 0 0 1 -5 -5l0 -8" />
    <Path d="M15 16h-5a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h5" />
  </Svg>
);
export default SvgBrandEtsy;

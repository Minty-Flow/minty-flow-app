import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlassChampagne = (props: SvgProps) => (
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
    <Path d="M9 21h6" />
    <Path d="M12 16v5" />
    <Path d="M8 5a4 2 0 1 0 8 0a4 2 0 1 0 -8 0" />
    <Path d="M8 5c0 6.075 1.79 11 4 11s4 -4.925 4 -11" />
  </Svg>
);
export default SvgGlassChampagne;

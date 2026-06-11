import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVideoPlus = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M13 5a3 3 0 0 1 3 3v.381l3.106 -1.552a2 2 0 0 1 2.894 1.789v6.765a2 2 0 0 1 -2.894 1.787l-3.106 -1.552v.382a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3zm-4 4a1 1 0 0 0 -1 1v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0 -2h-1v-1a1 1 0 0 0 -1 -1" />
  </Svg>
);
export default SvgVideoPlus;

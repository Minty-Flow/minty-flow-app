import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFile3D = (props: SvgProps) => (
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
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
    <Path d="M12 13.5l4 -1.5" />
    <Path d="M8 11.846l4 1.654v4.5l4 -1.846v-4.308l-4 -1.846l-4 1.846" />
    <Path d="M8 12v4.2l4 1.8" />
  </Svg>
);
export default SvgFile3D;

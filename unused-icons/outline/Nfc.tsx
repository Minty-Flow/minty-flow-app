import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNfc = (props: SvgProps) => (
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
    <Path d="M11 20a3 3 0 0 1 -3 -3v-11l5 5" />
    <Path d="M13 4a3 3 0 0 1 3 3v11l-5 -5" />
    <Path d="M4 7a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3l0 -10" />
  </Svg>
);
export default SvgNfc;

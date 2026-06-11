import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCubeUnfolded = (props: SvgProps) => (
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
    <Path d="M2 15h10v5h5v-5h5v-5h-10v-5h-5v5h-5l0 5" />
    <Path d="M7 15v-5h5v5h5v-5" />
  </Svg>
);
export default SvgCubeUnfolded;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPresentation = (props: SvgProps) => (
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
    <Path d="M3 4l18 0" />
    <Path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" />
    <Path d="M12 16l0 4" />
    <Path d="M9 20l6 0" />
    <Path d="M8 12l3 -3l2 2l3 -3" />
  </Svg>
);
export default SvgPresentation;

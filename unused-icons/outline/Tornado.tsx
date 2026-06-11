import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTornado = (props: SvgProps) => (
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
    <Path d="M21 4l-18 0" />
    <Path d="M13 16l-6 0" />
    <Path d="M11 20l4 0" />
    <Path d="M6 8l14 0" />
    <Path d="M4 12l12 0" />
  </Svg>
);
export default SvgTornado;

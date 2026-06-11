import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBorderBottom = (props: SvgProps) => (
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
    <Path d="M20 20l-16 0" />
    <Path d="M4 4l0 .01" />
    <Path d="M8 4l0 .01" />
    <Path d="M12 4l0 .01" />
    <Path d="M16 4l0 .01" />
    <Path d="M20 4l0 .01" />
    <Path d="M4 8l0 .01" />
    <Path d="M12 8l0 .01" />
    <Path d="M20 8l0 .01" />
    <Path d="M4 12l0 .01" />
    <Path d="M8 12l0 .01" />
    <Path d="M12 12l0 .01" />
    <Path d="M16 12l0 .01" />
    <Path d="M20 12l0 .01" />
    <Path d="M4 16l0 .01" />
    <Path d="M12 16l0 .01" />
    <Path d="M20 16l0 .01" />
  </Svg>
);
export default SvgBorderBottom;

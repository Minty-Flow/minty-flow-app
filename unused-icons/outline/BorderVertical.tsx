import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBorderVertical = (props: SvgProps) => (
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
    <Path d="M12 4l0 16" />
    <Path d="M4 4l0 .01" />
    <Path d="M8 4l0 .01" />
    <Path d="M16 4l0 .01" />
    <Path d="M20 4l0 .01" />
    <Path d="M4 8l0 .01" />
    <Path d="M20 8l0 .01" />
    <Path d="M4 12l0 .01" />
    <Path d="M8 12l0 .01" />
    <Path d="M16 12l0 .01" />
    <Path d="M20 12l0 .01" />
    <Path d="M4 16l0 .01" />
    <Path d="M20 16l0 .01" />
    <Path d="M4 20l0 .01" />
    <Path d="M8 20l0 .01" />
    <Path d="M16 20l0 .01" />
    <Path d="M20 20l0 .01" />
  </Svg>
);
export default SvgBorderVertical;

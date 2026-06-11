import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMouse2 = (props: SvgProps) => (
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
    <Path d="M6 7a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4l0 -10" />
    <Path d="M12 3v7" />
    <Path d="M6 10h12" />
  </Svg>
);
export default SvgMouse2;

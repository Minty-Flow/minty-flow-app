import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleKey = (props: SvgProps) => (
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
    <Path d="M12 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M12.5 11.5l-4 4l1.5 1.5" />
    <Path d="M12 15l-1.5 -1.5" />
  </Svg>
);
export default SvgCircleKey;

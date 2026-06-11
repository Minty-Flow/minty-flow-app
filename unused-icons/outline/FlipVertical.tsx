import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlipVertical = (props: SvgProps) => (
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
    <Path d="M12 3l0 18" />
    <Path d="M16 7l0 10l5 0l-5 -10" />
    <Path d="M8 7l0 10l-5 0l5 -10" />
  </Svg>
);
export default SvgFlipVertical;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCrown = (props: SvgProps) => (
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
    <Path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4l4 -6" />
  </Svg>
);
export default SvgCrown;

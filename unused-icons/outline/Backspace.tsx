import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBackspace = (props: SvgProps) => (
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
    <Path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5l11 0" />
    <Path d="M12 10l4 4m0 -4l-4 4" />
  </Svg>
);
export default SvgBackspace;

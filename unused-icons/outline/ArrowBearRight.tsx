import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBearRight = (props: SvgProps) => (
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
    <Path d="M12 3h5v5" />
    <Path d="M17 3l-7.536 7.536a5 5 0 0 0 -1.464 3.534v6.93" />
  </Svg>
);
export default SvgArrowBearRight;

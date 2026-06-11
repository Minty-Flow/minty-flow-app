import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowMergeAltRight = (props: SvgProps) => (
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
    <Path d="M16 7l-4 -4l-4 4" />
    <Path d="M6 21v.01" />
    <Path d="M6 18.01v.01" />
    <Path d="M7 15.02v.01" />
    <Path d="M10 13.03v.01" />
    <Path d="M12 3v5.394a6.737 6.737 0 0 0 3 5.606a6.737 6.737 0 0 1 3 5.606v1.394" />
  </Svg>
);
export default SvgArrowMergeAltRight;
